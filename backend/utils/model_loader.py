import os
import sys
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("moil.models")

# Ensure models directory is in python path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODELS_DIR = os.path.join(ROOT_DIR, "models")
if MODELS_DIR not in sys.path:
    sys.path.insert(0, MODELS_DIR)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

class ModelRegistrySingleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelRegistrySingleton, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if getattr(self, "_initialized", False):
            return
        
        self.models: Dict[str, Any] = {}
        self.model_status: Dict[str, bool] = {}
        self.model_versions: Dict[str, str] = {
            "shortfall": "SHORTFALL-GBM v1.0",
            "reserve": "RESERVE-RF v1.0",
            "equipment": "EQUIPMENT-GBM v1.0",
            "anomaly": "ANOMALY-IFOREST v1.0",
            "trust": "TRUST-BAYESIAN v1.0",
            "multi_risk": "MULTI-RISK-COMPOSITE v1.0"
        }
        
        self._load_all_models()
        self._initialized = True

    def _load_all_models(self):
        logger.info("Initializing MOIL Machine Learning Model Registry...")
        
        # 1. Shortfall Predictor
        try:
            from alert.alert_predictor import ShortfallPredictor
            shortfall_path = os.path.join(MODELS_DIR, "alert", "shortfall_model.pkl")
            self.models["shortfall"] = ShortfallPredictor(model_path=shortfall_path)
            self.model_status["shortfall"] = True
            logger.info("[OK] Production Shortfall Predictor loaded successfully.")
        except Exception as e:
            logger.warning(f"[WARN] Shortfall Predictor failed to load: {e}. Falling back to heuristic mode.")
            self.models["shortfall"] = None
            self.model_status["shortfall"] = False

        # 2. Reserve Prospectivity Predictor
        try:
            from reserve.reserve_predictor import ReservePredictor
            reserve_path = os.path.join(MODELS_DIR, "reserve", "prospectivity_model.pkl")
            self.models["reserve"] = ReservePredictor(model_path=reserve_path)
            self.model_status["reserve"] = True
            logger.info("[OK] Reserve Radar Prospectivity Predictor loaded successfully.")
        except Exception as e:
            logger.warning(f"[WARN] Reserve Predictor failed to load: {e}. Falling back to heuristic mode.")
            self.models["reserve"] = None
            self.model_status["reserve"] = False

        # 3. Equipment Failure & RUL Predictor
        try:
            from equipment.equipment_predictor import EquipmentPredictor
            equip_path = os.path.join(MODELS_DIR, "equipment", "equipment_model.pkl")
            self.models["equipment"] = EquipmentPredictor(model_path=equip_path)
            self.model_status["equipment"] = True
            logger.info("[OK] Equipment Failure & RUL Predictor loaded successfully.")
        except Exception as e:
            logger.warning(f"[WARN] Equipment Predictor failed to load: {e}. Falling back to heuristic mode.")
            self.models["equipment"] = None
            self.model_status["equipment"] = False

        # 4. Anomaly Detector
        try:
            from anomaly.anomaly_detector import AnomalyDetector
            anomaly_path = os.path.join(MODELS_DIR, "anomaly", "anomaly_model.pkl")
            self.models["anomaly"] = AnomalyDetector(model_path=anomaly_path)
            self.model_status["anomaly"] = True
            logger.info("[OK] Operational Anomaly Detector loaded successfully.")
        except Exception as e:
            logger.warning(f"[WARN] Anomaly Detector failed to load: {e}. Falling back to heuristic mode.")
            self.models["anomaly"] = None
            self.model_status["anomaly"] = False

        # 5. Trust Engine
        try:
            from trust.trust_engine import TrustEngine
            self.models["trust"] = TrustEngine()
            self.model_status["trust"] = True
            logger.info("[OK] Bayesian AI Trust Engine initialized successfully.")
        except Exception as e:
            logger.warning(f"[WARN] Trust Engine failed to initialize: {e}.")
            self.models["trust"] = None
            self.model_status["trust"] = False

        # 6. Multi-Risk Composite Engine
        try:
            from common.multi_risk_engine import MultiRiskIntelligenceEngine
            self.models["multi_risk"] = MultiRiskIntelligenceEngine()
            self.model_status["multi_risk"] = self.models["multi_risk"].is_ready
            logger.info("[OK] Multi-Risk Intelligence Engine loaded successfully.")
        except Exception as e:
            logger.warning(f"[WARN] Multi-Risk Engine failed to load: {e}.")
            self.models["multi_risk"] = None
            self.model_status["multi_risk"] = False

    def get_model(self, model_name: str):
        return self.models.get(model_name)

    def is_model_available(self, model_name: str) -> bool:
        return bool(self.model_status.get(model_name, False))

    def get_health_status(self) -> Dict[str, Any]:
        return {
            "all_models_operational": all(self.model_status.values()),
            "models_status": self.model_status,
            "model_versions": self.model_versions
        }

# Global Singleton Instance
model_registry = ModelRegistrySingleton()
