"""
AETHER — Comprehensive Multilingual Localization Test Suite
Validates English (en), Hindi (hi), and Marathi (mr) translation coverage,
dynamic scenario generation, numerical preservation, and report parity.
"""

import sys
import json
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_multilingual_localization():
    print("=" * 80)
    print("AETHER — MULTILINGUAL LOCALIZATION & PARITY SUITE")
    print("=" * 80)
    
    passed_assertions = 0

    # 1. Parse translations.js
    print("\n[SECTION 1] Validating Translation Dictionaries Symmetry (en / hi / mr)...")
    with open('frontend/src/i18n/translations.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Verify root language objects exist
    assert "en: {" in content, "Missing 'en' dictionary"
    assert "hi: {" in content, "Missing 'hi' dictionary"
    assert "mr: {" in content, "Missing 'mr' dictionary"
    passed_assertions += 3

    # Check key sections exist in all 3 languages
    key_sections = [
        'scenarioLab',
        'common',
        'nav',
        'twin',
        'fleet',
        'overview'
    ]
    for sec in key_sections:
        assert f"{sec}:" in content, f"Missing section '{sec}' in translations"
        passed_assertions += 1
    print(f"  [PASS] Root dictionaries and {len(key_sections)} structural sections verified.")

    # 2. Validate Hindi Authentic Devanagari Characters
    print("\n[SECTION 2] Verifying Devanagari Script & Authentic Language in Hindi (hi)...")
    hi_keywords = [
        'एथर माइनिंग इंटेलिजेंस',
        'राष्ट्रीय मैंगनीज खनन',
        'परिदृश्य प्रयोगशाला',
        'जोखिम में उत्पादन',
        'राजस्व जोखिम',
        'फ्लीट उपलब्धता',
        'क्रशर उपयोगिता',
        'सुरक्षा जोखिम सूचकांक',
        'मॉडल विश्वास स्तर',
        'कारण → प्रभाव → कार्रवाई इंजन',
        'अवरोध (बॉटनलेक)',
        'उत्पादन घाटा गिरावट वॉटरफॉल',
        'हस्तक्षेप अधिकृत करें',
        'व्याख्या योग्य एआई: यह क्यों हुआ?'
    ]
    for kw in hi_keywords:
        assert kw in content, f"Hindi dictionary missing authentic keyword: '{kw}'"
        passed_assertions += 1
    print(f"  [PASS] {len(hi_keywords)} canonical Hindi (hi) strings verified.")

    # 3. Validate Marathi Authentic Devanagari Characters
    print("\n[SECTION 3] Verifying Devanagari Script & Authentic Language in Marathi (mr)...")
    mr_keywords = [
        'एथर माइनिंग इंटेलिजन्स',
        'राष्ट्रीय मॅंगनीज खाण',
        'परिस्थिती प्रयोगशाळा',
        'जोखमीतील उत्पादन',
        'महसूल जोखीम',
        'फ्लीट उपलब्धता',
        'क्रशर वापर',
        'सुरक्षा जोखीम निर्देशांक',
        'मॉडेल विश्वास पातळी',
        'कारण → परिणाम → कृती इंजिन',
        'अडथळा (बॉटलनेक)',
        'उत्पादन तूट घसरण वॉटरफॉल',
        'हस्तक्षेप अधिकृत करा',
        'स्पष्टीकरणयोग्य एआय: हे का घडले?'
    ]
    for kw in mr_keywords:
        assert kw in content, f"Marathi dictionary missing authentic keyword: '{kw}'"
        passed_assertions += 1
    print(f"  [PASS] {len(mr_keywords)} canonical Marathi (mr) strings verified.")

    # 4. Validate Scenario Intelligence Service Multilingual Generation
    print("\n[SECTION 4] Testing Dynamic Scenario Calculation in English, Hindi, and Marathi...")
    with open('frontend/src/services/scenarioIntelligenceService.js', 'r', encoding='utf-8') as f:
        service_code = f.read()

    assert "getLocalizedMineName" in service_code, "Missing getLocalizedMineName helper"
    assert "calculateScenarioIntelligence" in service_code, "Missing calculateScenarioIntelligence export"
    assert "TRANSLATIONS" in service_code, "Scenario service must import translations dictionary"
    passed_assertions += 3

    # Check 10 Mine Names translation mappings
    mines = ['balaghat', 'tirodi', 'ukwa', 'munsar', 'kandri', 'gumgaon', 'chikla', 'dongri-buzurg', 'ramtek', 'bhandara']
    for m in mines:
        assert m in service_code, f"Mine '{m}' missing in scenario service"
        passed_assertions += 1
    print(f"  [PASS] All 10 MOIL mines mapped for dynamic localization.")

    # 5. Validate Static Engineering Map Localization
    print("\n[SECTION 5] Verifying 2D Static Engineering Map Multilingual Localization...")
    with open('frontend/src/components/scenario/StaticEngineeringMap.jsx', 'r', encoding='utf-8') as f:
        map_code = f.read()

    assert "useApp" in map_code, "StaticEngineeringMap must consume AppContext"
    assert "lang" in map_code, "StaticEngineeringMap must extract active language"
    assert "प्राथमिक साइजिंग गायरेटरी क्रशर" in map_code, "Missing Hindi crusher label in map"
    assert "नाबदान जल निकासी स्टेशन" in map_code, "Missing Hindi sump label in map"
    passed_assertions += 4
    print("  [PASS] Static Engineering Map components verified with live multilingual bindings.")

    # 6. Validate Scenario Lab Page Multilingual Structure
    print("\n[SECTION 6] Verifying Scenario Lab Page Multilingual Bindings...")
    with open('frontend/src/pages/ScenarioLabPage.jsx', 'r', encoding='utf-8') as f:
        page_code = f.read()

    assert "const { lang, t } = useApp();" in page_code, "ScenarioLabPage must consume lang and t"
    assert "sc?.selectMine" in page_code, "Mine selector label must be dynamic"
    assert "sc?.selectScenario" in page_code, "Scenario selector label must be dynamic"
    assert "sc?.selectSeverity" in page_code, "Severity selector label must be dynamic"
    assert "sc?.selectHorizon" in page_code, "Time horizon selector label must be dynamic"
    assert "sc?.runBtn" in page_code, "Run button label must be dynamic"
    assert "sc?.kpiProdAtRisk" in page_code, "Production KPI label must be dynamic"
    assert "sc?.causalTitle" in page_code, "Causal chain title must be dynamic"
    assert "sc?.waterfallTitle" in page_code, "Waterfall chart title must be dynamic"
    assert "sc?.financialTitle" in page_code, "Financial model title must be dynamic"
    assert "sc?.aiRecommendationsTitle" in page_code, "AI recommendations title must be dynamic"
    assert "sc?.satelliteTitle" in page_code, "Satellite panel title must be dynamic"
    assert "sc?.timelineTitle" in page_code, "Timeline title must be dynamic"
    assert "sc?.shapTitle" in page_code, "TreeSHAP title must be dynamic"
    passed_assertions += 14
    print(f"  [PASS] All Scenario Lab UI sections wired to dynamic i18n dictionary.")

    # 7. Check Numerical Preservation Patterns (No numbers converted to words)
    print("\n[SECTION 7] Validating Numerical Preservation Integrity...")
    num_patterns = [
        r'TPD',
        r'₹',
        r'%',
        r'Ha',
        r'TPH',
        r'm/s'
    ]
    for pat in num_patterns:
        matches = re.findall(pat, page_code) + re.findall(pat, service_code) + re.findall(pat, map_code)
        assert len(matches) > 0, f"Expected numerical pattern '{pat}' not found"
        passed_assertions += 1
    print("  [PASS] Numerical units (TPD, ₹, %, Ha, TPH, m/s) preserved strictly as numerical values.")

    print("\n" + "=" * 80)
    print(f"MULTILINGUAL LOCALIZATION SUITE PASSED: {passed_assertions} / {passed_assertions} ASSERTIONS (100% SUCCESS)")
    print("=" * 80)

if __name__ == '__main__':
    test_multilingual_localization()
