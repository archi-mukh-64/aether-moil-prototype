import os
import sqlite3
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from ..config import settings
from ..utils.logging_config import logger

def get_db_connection():
    """
    Returns a database connection.
    If settings.database_url (PostgreSQL / Supabase) is set and reachable, connects via psycopg2.
    Otherwise, gracefully connects to local SQLite with dictionary/Row factory.
    """
    db_url = settings.database_url
    if db_url and (db_url.startswith("postgresql://") or db_url.startswith("postgres://")):
        try:
            import psycopg2
            import psycopg2.extras
            conn = psycopg2.connect(db_url)
            return conn
        except Exception as pg_err:
            logger.warning(f"[DB] PostgreSQL/Supabase connection failed ({pg_err}). Falling back to local SQLite.")

    # SQLite Resilient Fallback
    db_path = settings.database_path
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def is_postgres(conn) -> bool:
    return not isinstance(conn, sqlite3.Connection)

def init_db():
    """
    Initializes database tables for operator audit logs, scenario runs, and operator feedback.
    Compatible with both PostgreSQL and SQLite.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if is_postgres(conn):
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS operator_feedback (
                id SERIAL PRIMARY KEY,
                timestamp TEXT NOT NULL,
                mine_id TEXT NOT NULL,
                prediction_type TEXT NOT NULL,
                model_version TEXT,
                predicted_value TEXT,
                actual_observed_value TEXT,
                operator_rating INTEGER,
                operator_comment TEXT,
                operator_name TEXT,
                shift_id TEXT
            );
            """)
            
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit_decisions (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                mine_id TEXT NOT NULL,
                scenario_type TEXT,
                severity TEXT,
                detected_signal TEXT,
                prediction_summary TEXT,
                recommended_action_id TEXT,
                recommended_action_title TEXT,
                operator_decision TEXT NOT NULL,
                operator_name TEXT NOT NULL,
                operator_role TEXT,
                operator_notes TEXT,
                realized_impact TEXT,
                dgms_compliance_code TEXT
            );
            """)
        else:
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS operator_feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                mine_id TEXT NOT NULL,
                prediction_type TEXT NOT NULL,
                model_version TEXT,
                predicted_value TEXT,
                actual_observed_value TEXT,
                operator_rating INTEGER,
                operator_comment TEXT,
                operator_name TEXT,
                shift_id TEXT
            );
            """)
            
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit_decisions (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                mine_id TEXT NOT NULL,
                scenario_type TEXT,
                severity TEXT,
                detected_signal TEXT,
                prediction_summary TEXT,
                recommended_action_id TEXT,
                recommended_action_title TEXT,
                operator_decision TEXT NOT NULL,
                operator_name TEXT NOT NULL,
                operator_role TEXT,
                operator_notes TEXT,
                realized_impact TEXT,
                dgms_compliance_code TEXT
            );
            """)
        
        conn.commit()
        conn.close()
    except Exception as e:
        logger.warning(f"[DB] init_db warning: {e}")

# Auto-initialize DB on module import
init_db()

def log_decision(
    decision_id: str,
    mine_id: str,
    operator_decision: str,
    operator_name: str,
    scenario_type: Optional[str] = None,
    severity: Optional[str] = None,
    detected_signal: Optional[str] = None,
    prediction_summary: Optional[str] = None,
    action_id: Optional[str] = None,
    action_title: Optional[str] = None,
    operator_role: Optional[str] = "Shift Controller",
    operator_notes: Optional[str] = None,
    realized_impact: Optional[str] = None,
    dgms_compliance_code: Optional[str] = "DGMS-2026-COMPLIANT"
) -> Dict[str, Any]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        ts = datetime.now(timezone.utc).isoformat()
        placeholder = "%s" if is_postgres(conn) else "?"
        
        if is_postgres(conn):
            cursor.execute(f"""
            INSERT INTO audit_decisions (
                id, timestamp, mine_id, scenario_type, severity,
                detected_signal, prediction_summary, recommended_action_id, recommended_action_title,
                operator_decision, operator_name, operator_role, operator_notes,
                realized_impact, dgms_compliance_code
            ) VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})
            ON CONFLICT (id) DO UPDATE SET
                operator_decision = EXCLUDED.operator_decision,
                operator_name = EXCLUDED.operator_name,
                operator_notes = EXCLUDED.operator_notes;
            """, (
                decision_id, ts, mine_id, scenario_type, severity,
                detected_signal, prediction_summary, action_id, action_title,
                operator_decision, operator_name, operator_role, operator_notes,
                realized_impact, dgms_compliance_code
            ))
        else:
            cursor.execute(f"""
            INSERT OR REPLACE INTO audit_decisions (
                id, timestamp, mine_id, scenario_type, severity,
                detected_signal, prediction_summary, recommended_action_id, recommended_action_title,
                operator_decision, operator_name, operator_role, operator_notes,
                realized_impact, dgms_compliance_code
            ) VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})
            """, (
                decision_id, ts, mine_id, scenario_type, severity,
                detected_signal, prediction_summary, action_id, action_title,
                operator_decision, operator_name, operator_role, operator_notes,
                realized_impact, dgms_compliance_code
            ))
            
        conn.commit()
        return {
            "id": decision_id,
            "timestamp": ts,
            "status": "RECORDED",
            "mine_id": mine_id,
            "operator_decision": operator_decision
        }
    finally:
        conn.close()

def record_feedback(
    mine_id: str,
    prediction_type: str,
    predicted_value: str,
    actual_observed_value: Optional[str] = None,
    operator_rating: Optional[int] = 5,
    operator_comment: Optional[str] = None,
    operator_name: Optional[str] = "Mining Engineer",
    shift_id: Optional[str] = "SHIFT-A",
    model_version: Optional[str] = "1.0.0"
) -> Dict[str, Any]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        ts = datetime.now(timezone.utc).isoformat()
        placeholder = "%s" if is_postgres(conn) else "?"
        
        cursor.execute(f"""
        INSERT INTO operator_feedback (
            timestamp, mine_id, prediction_type, model_version,
            predicted_value, actual_observed_value, operator_rating,
            operator_comment, operator_name, shift_id
        ) VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})
        """, (
            ts, mine_id, prediction_type, model_version,
            predicted_value, actual_observed_value, operator_rating,
            operator_comment, operator_name, shift_id
        ))
        conn.commit()
        inserted_id = cursor.lastrowid if not is_postgres(conn) else 1
        return {
            "id": inserted_id,
            "timestamp": ts,
            "status": "FEEDBACK_STORED",
            "mine_id": mine_id
        }
    finally:
        conn.close()

def get_recent_audit_decisions(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        placeholder = "%s" if is_postgres(conn) else "?"
        cursor.execute(f"SELECT * FROM audit_decisions ORDER BY timestamp DESC LIMIT {placeholder}", (limit,))
        
        if is_postgres(conn):
            columns = [desc[0] for desc in cursor.description]
            rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
        else:
            rows = [dict(r) for r in cursor.fetchall()]
            
        return rows
    finally:
        conn.close()

def get_recent_feedback(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        placeholder = "%s" if is_postgres(conn) else "?"
        cursor.execute(f"SELECT * FROM operator_feedback ORDER BY timestamp DESC LIMIT {placeholder}", (limit,))
        
        if is_postgres(conn):
            columns = [desc[0] for desc in cursor.description]
            rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
        else:
            rows = [dict(r) for r in cursor.fetchall()]
            
        return rows
    finally:
        conn.close()
