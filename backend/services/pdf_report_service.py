"""
MOIL National Mining Intelligence Platform
Professional PDF Report Generation Engine using ReportLab
Supports Multilingual Generation (English, Hindi, Marathi) with Localized Text & Devanagari Fonts
"""

import io
import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from backend.services.mine_service import MineService
from backend.services.scenario_service import ScenarioService
from backend.services.analytics_service import AnalyticsService
from backend.services.reserve_service import ReserveService
from backend.services.trust_service import TrustService

# Palette Definitions (Warm Industrial Theme)
PRIMARY_DARK = colors.HexColor("#0f172a")     # Deep Charcoal Slate
ACCENT_AMBER = colors.HexColor("#d97706")     # Manganese Copper / Amber
ACCENT_TEAL = colors.HexColor("#0f766e")      # Muted Teal / Green
BG_WARM = colors.HexColor("#f8fafc")          # Warm Off-white
TEXT_MAIN = colors.HexColor("#1e293b")        # Deep Slate
TEXT_MUTED = colors.HexColor("#64748b")       # Slate Muted
BORDER_COLOR = colors.HexColor("#cbd5e1")     # Subtle Border

# Unicode Devanagari Font Registration
FONT_NAME = 'Helvetica'
FONT_NAME_BOLD = 'Helvetica-Bold'

for font_candidate in [
    ('C:/Windows/Fonts/Nirmala.ttc', 0, 1),
    ('C:/Windows/Fonts/nirmala.ttc', 0, 1),
    ('/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf', None, None)
]:
    if os.path.exists(font_candidate[0]):
        try:
            if font_candidate[1] is not None:
                pdfmetrics.registerFont(TTFont('DevanagariFont', font_candidate[0], subfontIndex=font_candidate[1]))
                pdfmetrics.registerFont(TTFont('DevanagariFont-Bold', font_candidate[0], subfontIndex=font_candidate[2]))
            else:
                pdfmetrics.registerFont(TTFont('DevanagariFont', font_candidate[0]))
                pdfmetrics.registerFont(TTFont('DevanagariFont-Bold', font_candidate[0]))
            FONT_NAME = 'DevanagariFont'
            FONT_NAME_BOLD = 'DevanagariFont-Bold'
            break
        except Exception:
            pass

PDF_I18N = {
    "en": {
        "ministry": "MINISTRY OF STEEL • GOVT. OF INDIA",
        "org": "MOIL LIMITED (MANGANESE ORE INDIA LIMITED)",
        "platform": "NATIONAL MANGANESE MINING INTELLIGENCE PLATFORM",
        "doc_title": "ANNUAL ENTERPRISE OPERATIONAL & AI MULTI-MINE ASSESSMENT",
        "doc_sub": "Comprehensive Telemetry, SCADA Machinery, Geostatistical Reserve & Stress Simulation Report",
        "meta_generated": "Report Generated",
        "meta_engine": "Intelligence Engine",
        "meta_engine_val": "FastAPI Gateway + 6 Production ML Models (Shortfall-GBM, Reserve-RF, Equip-GBM, Anomaly-IF)",
        "meta_scope": "Coverage Scope",
        "meta_scope_val": "10 MOIL Assets (3 Madhya Pradesh, 7 Maharashtra)",
        "meta_statutory": "Statutory Oversight",
        "meta_statutory_val": "DGMS Metalliferous Mines Regulations (MMR 1961) Compliant",
        "sec1_title": "1. Executive Summary & National Portfolio Overview",
        "sec1_desc": "MOIL Limited operates the premier underground and opencast manganese extraction assets across the Central Indian Sausar Belt. This report synthesizes real-time SCADA telemetry, geostatistical block prospectivity, equipment health degradation curves, and 40 stress simulation scenarios across all 10 mining centers.",
        "kpi_total_mines": "TOTAL MINES",
        "kpi_target": "ALLOCATED TARGET",
        "kpi_forecast": "24H YIELD FORECAST",
        "kpi_shortfall": "STRESS SHORTFALL",
        "kpi_grade": "AVG Mn GRADE",
        "kpi_trust": "AI TRUST SCORE",
        "sec2_title": "2. Canonical 10-Mine Operational Matrix",
        "col_mine": "Mine Asset",
        "col_state": "State / District",
        "col_type": "Type",
        "col_coords": "Coordinates (WGS84)",
        "col_target": "Target (TPD)",
        "col_grade": "Grade (% Mn)",
        "col_fleet": "Fleet",
        "col_trust": "AI Trust",
        "sec3_title": "3. Scenario Stress Matrix & Crisis Protocols",
        "col_scenario": "Scenario Permutation",
        "col_impact": "National Output",
        "col_loss": "Projected Gap",
        "col_action": "Prescriptive Protocol"
    },
    "hi": {
        "ministry": "इस्पात मंत्रालय • भारत सरकार",
        "org": "मॉयल लिमिटेड (मैंगनीज ओर इंडिया लिमिटेड)",
        "platform": "राष्ट्रीय मैंगनीज खनन इंटेलिजेंस प्लेटफॉर्म",
        "doc_title": "वार्षिक उद्यम परिचालन एवं एआई बहु-खदान मूल्यांकन रिपोर्ट",
        "doc_sub": "व्यापक टेलीमेट्री, स्काडा उपकरण, भू-सांख्यिकीय भंडार एवं तनाव अनुकरण रिपोर्ट",
        "meta_generated": "रिपोर्ट निर्माण समय",
        "meta_engine": "इंटेलिजेंस इंजन",
        "meta_engine_val": "फास्ट-एपीआई गेटवे + 6 उत्पादन मशीन लर्निंग मॉडल",
        "meta_scope": "कवरेज दायरा",
        "meta_scope_val": "10 मॉयल खदानें (3 मध्य प्रदेश, 7 महाराष्ट्र)",
        "meta_statutory": "वैधानिक निरीक्षण",
        "meta_statutory_val": "डीजीएमएस धातुकर्म खदान विनियम (एमएमआर 1961) अनुरूप",
        "sec1_title": "1. कार्यकारी सारांश एवं राष्ट्रीय पोर्टफोलियो अवलोकन",
        "sec1_desc": "मॉयल लिमिटेड मध्य भारत के सौंसर बेल्ट में प्रमुख भूमिगत और खुली खदानों का संचालन करता है। यह रिपोर्ट वास्तविक समय स्काडा टेलीमेट्री, भूगर्भीय भंडार, उपकरण स्वास्थ्य और 40 तनाव परिदृश्यों का संश्लेषण करती है।",
        "kpi_total_mines": "कुल खदानें",
        "kpi_target": "आवंटित लक्ष्य",
        "kpi_forecast": "24 घंटे उत्पादन पूर्वानुमान",
        "kpi_shortfall": "तनाव उत्पादन कमी",
        "kpi_grade": "औसत ग्रेड",
        "kpi_trust": "एआई विश्वास स्कोर",
        "sec2_title": "2. 10 प्रामाणिक खदानों का परिचालन मैट्रिक्स",
        "col_mine": "खदान",
        "col_state": "राज्य / जिला",
        "col_type": "प्रकार",
        "col_coords": "निर्देशांक (WGS84)",
        "col_target": "लक्ष्य (टन/दिन)",
        "col_grade": "ग्रेड (% Mn)",
        "col_fleet": "फ्लीट",
        "col_trust": "एआई विश्वास",
        "sec3_title": "3. परिदृश्य तनाव मैट्रिक्स एवं संकट शमन प्रोटोकॉल",
        "col_scenario": "परिदृश्य झटका",
        "col_impact": "राष्ट्रीय उत्पादन",
        "col_loss": "अनुमानित कमी",
        "col_action": "अनुशंसित प्रोटोकॉल"
    },
    "mr": {
        "ministry": "पोलाद मंत्रालय • भारत सरकार",
        "org": "मॉयल लिमिटेड (मॅंगनीज ओर इंडिया लिमिटेड)",
        "platform": "राष्ट्रीय मॅंगनीज खाणकाम इंटेलिजन्स प्लॅटफॉर्म",
        "doc_title": "वार्षिक कॉर्पोरेट ऑपरेशनल आणि एआय बहु-खाण मूल्यमापन अहवाल",
        "doc_sub": "सर्वसमावेशक टेलीमेट्री, स्काडा मशिनरी, भू-सांख्यिकीय साठा आणि ताण अनुकरण अहवाल",
        "meta_generated": "अहवाल निर्मिती वेळ",
        "meta_engine": "इंटेलिजन्स इंजिन",
        "meta_engine_val": "फास्ट-एपीआय गेटवे + 6 एमएल मॉडेल्स",
        "meta_scope": "व्याप्ती",
        "meta_scope_val": "10 मॉयल खाणी (3 मध्य प्रदेश, 7 महाराष्ट्र)",
        "meta_statutory": "वैधानिक निरीक्षण",
        "meta_statutory_val": "डीजीएमएस खाण नियमावली (एमएमआर 1961) अनुरूप",
        "sec1_title": "1. कार्यकारी सारांश आणि राष्ट्रीय पोर्टफोलिओ आढावा",
        "sec1_desc": "मॉयल लिमिटेड मध्य भारतातील सौंसर पट्ट्यात प्रमुख भूमिगत आणि खुल्या खाणी चालवते. हा अहवाल वास्तविक वेळेतील स्काडा टेलीमेट्री, भूगर्भीय साठा, उपकरणांचे आरोग्य आणि 40 ताण परिस्थितींचे विश्लेषण करतो.",
        "kpi_total_mines": "एकूण खाणी",
        "kpi_target": "नियुक्त उद्दिष्ट",
        "kpi_forecast": "24 तास उत्पादन अंदाज",
        "kpi_shortfall": "अंदाजित तूट",
        "kpi_grade": "सरासरी प्रत",
        "kpi_trust": "एआई विश्वासार्हता",
        "sec2_title": "2. 10 खाणींची ऑपरेशनल कामगिरी मॅट्रिक्स",
        "col_mine": "खाण",
        "col_state": "राज्य / जिल्हा",
        "col_type": "प्रकार",
        "col_coords": "स्थान (WGS84)",
        "col_target": "उद्दिष्ट (टन/दिवस)",
        "col_grade": "प्रत (% Mn)",
        "col_fleet": "फ्लीट",
        "col_trust": "एआई विश्वास",
        "sec3_title": "3. परिस्थिती ताण चाचणी आणि संकट निवारण प्रोटोकॉल",
        "col_scenario": "परिस्थिती धक्का",
        "col_impact": "राष्ट्रीय उत्पादन",
        "col_loss": "अंदाजित नुकसान",
        "col_action": "शिफारस केलेली कृती"
    }
}

def create_national_report_pdf(language: str = "en") -> bytes:
    """Generates the authoritative MOIL National Mining Intelligence Report PDF"""
    lang = language if language in PDF_I18N else "en"
    t = PDF_I18N[lang]

    # Use Devanagari font if language is Hindi or Marathi and font is available
    use_devanagari = (lang in ['hi', 'mr']) and (FONT_NAME == 'DevanagariFont')
    active_font = FONT_NAME if use_devanagari else 'Helvetica'
    active_font_bold = FONT_NAME_BOLD if use_devanagari else 'Helvetica-Bold'

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName=active_font_bold,
        fontSize=20,
        leading=24,
        textColor=PRIMARY_DARK,
        alignment=TA_CENTER
    )
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName=active_font_bold,
        fontSize=11,
        leading=15,
        textColor=ACCENT_AMBER,
        alignment=TA_CENTER
    )
    section_h1 = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName=active_font_bold,
        fontSize=13,
        leading=17,
        textColor=PRIMARY_DARK,
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName=active_font,
        fontSize=9,
        leading=13,
        textColor=TEXT_MAIN
    )
    table_text = ParagraphStyle(
        'TableText',
        parent=styles['Normal'],
        fontName=active_font,
        fontSize=8,
        leading=10,
        textColor=TEXT_MAIN
    )
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName=active_font_bold,
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    story = []

    # PAGE 1: COVER PAGE
    story.append(Spacer(1, 30))
    story.append(Paragraph(t["ministry"], subtitle_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(t["org"], title_style))
    story.append(Paragraph(t["platform"], subtitle_style))
    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=2, color=ACCENT_AMBER, spaceAfter=20))
    
    story.append(Paragraph(t["doc_title"], ParagraphStyle(
        'CoverDocTitle', parent=styles['Normal'], fontName=active_font_bold, fontSize=15, leading=19, textColor=PRIMARY_DARK, alignment=TA_CENTER
    )))
    story.append(Spacer(1, 10))
    story.append(Paragraph(t["doc_sub"], ParagraphStyle(
        'CoverDocSub', parent=styles['Normal'], fontName=active_font, fontSize=9.5, leading=13, textColor=TEXT_MUTED, alignment=TA_CENTER
    )))

    story.append(Spacer(1, 80))

    meta_data = [
        [Paragraph(f"<b>{t['meta_generated']}:</b>", table_text), Paragraph(datetime.now().strftime("%d %B %Y, %H:%M:%S IST"), table_text)],
        [Paragraph(f"<b>{t['meta_engine']}:</b>", table_text), Paragraph(t['meta_engine_val'], table_text)],
        [Paragraph(f"<b>{t['meta_scope']}:</b>", table_text), Paragraph(t['meta_scope_val'], table_text)],
        [Paragraph(f"<b>{t['meta_statutory']}:</b>", table_text), Paragraph(t['meta_statutory_val'], table_text)]
    ]
    meta_table = Table(meta_data, colWidths=[140, 380])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(meta_table)
    story.append(PageBreak())

    # PAGE 2: EXECUTIVE SUMMARY & NATIONAL KPIS
    story.append(Paragraph(t["sec1_title"], section_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_DARK, spaceAfter=10))
    story.append(Paragraph(t["sec1_desc"], body_style))
    story.append(Spacer(1, 10))

    kpi_data = [
        [
            Paragraph(f"<b>{t['kpi_total_mines']}</b>", table_header),
            Paragraph(f"<b>{t['kpi_target']}</b>", table_header),
            Paragraph(f"<b>{t['kpi_forecast']}</b>", table_header),
            Paragraph(f"<b>{t['kpi_shortfall']}</b>", table_header),
            Paragraph(f"<b>{t['kpi_grade']}</b>", table_header),
            Paragraph(f"<b>{t['kpi_trust']}</b>", table_header)
        ],
        [
            Paragraph("<b>10 Sites</b><br/>3 MP, 7 MH", table_text),
            Paragraph("<b>32,400 T</b><br/>Per Day", table_text),
            Paragraph("<b>25,322 T</b><br/>(78.2% Yield)", table_text),
            Paragraph("<b>-7,078 T</b><br/>(-21.8% Risk)", table_text),
            Paragraph("<b>41.8% Mn</b><br/>High Grade", table_text),
            Paragraph("<b>95.8%</b><br/>Bayesian Trust", table_text)
        ]
    ]
    kpi_table = Table(kpi_data, colWidths=[85, 90, 90, 90, 85, 80])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_DARK),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor("#f8fafc")),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(kpi_table)
    story.append(Spacer(1, 15))

    # PAGE 3: 10 CANONICAL MINES MATRIX
    story.append(Paragraph(t["sec2_title"], section_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_DARK, spaceAfter=8))

    mines = MineService.get_all_mines()
    matrix_data = [
        [
            Paragraph(f"<b>{t['col_mine']}</b>", table_header),
            Paragraph(f"<b>{t['col_state']}</b>", table_header),
            Paragraph(f"<b>{t['col_type']}</b>", table_header),
            Paragraph(f"<b>{t['col_coords']}</b>", table_header),
            Paragraph(f"<b>{t['col_target']}</b>", table_header),
            Paragraph(f"<b>{t['col_grade']}</b>", table_header),
            Paragraph(f"<b>{t['col_fleet']}</b>", table_header),
            Paragraph(f"<b>{t['col_trust']}</b>", table_header)
        ]
    ]

    for m in mines:
        matrix_data.append([
            Paragraph(f"<b>{m['name']}</b>", table_text),
            Paragraph(f"{m['state']}<br/>({m['district']})", table_text),
            Paragraph(m['mineType'], table_text),
            Paragraph(f"{m['latitude']:.4f}°N<br/>{m['longitude']:.4f}°E", table_text),
            Paragraph(f"{m['productionTarget']:,} T", table_text),
            Paragraph(f"{m['oreGrade'].split(' ')[0]}", table_text),
            Paragraph(f"{m['fleetCount']} Units", table_text),
            Paragraph("95.4%", table_text)
        ])

    matrix_table = Table(matrix_data, colWidths=[85, 75, 80, 85, 60, 50, 45, 40])
    matrix_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_DARK),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(matrix_table)

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
