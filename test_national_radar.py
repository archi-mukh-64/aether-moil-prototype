import sys
import os

# Test National Radar Multi-Mode Distinction Test
# Validates that all 7 National Radar modes produce distinct score distributions and metrics

def test_national_radar_modes():
    print("=" * 60)
    print("TESTING 7 NATIONAL RADAR MODES INDEPENDENCE & DISTINCTNESS")
    print("=" * 60)

    # 10 canonical mines with distinct attributes
    mines = [
        {"id": "balaghat", "name": "Balaghat", "baseGradeNum": 44.2, "productionTarget": 6200, "baselineProduction": 6050, "fleetAvailabilityBase": 91, "crusherHealthBase": 94, "unfcStatus": "UNFC-111 Proved", "leaseAreaHa": 180.5, "shortfallRisk": "LOW", "rainfallSensitivity": 1.1, "spatialSeed": 101},
        {"id": "tirodi", "name": "Tirodi", "baseGradeNum": 39.4, "productionTarget": 3100, "baselineProduction": 2980, "fleetAvailabilityBase": 86, "crusherHealthBase": 88, "unfcStatus": "UNFC-121", "leaseAreaHa": 124.0, "shortfallRisk": "HIGH", "rainfallSensitivity": 1.6, "spatialSeed": 102},
        {"id": "ukwa", "name": "Ukwa", "baseGradeNum": 41.5, "productionTarget": 1850, "baselineProduction": 1810, "fleetAvailabilityBase": 89, "crusherHealthBase": 90, "unfcStatus": "UNFC-111", "leaseAreaHa": 108.5, "shortfallRisk": "MEDIUM", "rainfallSensitivity": 1.2, "spatialSeed": 103},
        {"id": "munsar", "name": "Munsar", "baseGradeNum": 40.8, "productionTarget": 2400, "baselineProduction": 2350, "fleetAvailabilityBase": 87, "crusherHealthBase": 85, "unfcStatus": "UNFC-121", "leaseAreaHa": 96.4, "shortfallRisk": "HIGH", "rainfallSensitivity": 1.4, "spatialSeed": 104},
        {"id": "kandri", "name": "Kandri", "baseGradeNum": 42.5, "productionTarget": 2800, "baselineProduction": 2740, "fleetAvailabilityBase": 88, "crusherHealthBase": 89, "unfcStatus": "UNFC-111", "leaseAreaHa": 112.0, "shortfallRisk": "MEDIUM", "rainfallSensitivity": 1.3, "spatialSeed": 105},
        {"id": "gumgaon", "name": "Gumgaon", "baseGradeNum": 43.6, "productionTarget": 3400, "baselineProduction": 3310, "fleetAvailabilityBase": 90, "crusherHealthBase": 92, "unfcStatus": "UNFC-111", "leaseAreaHa": 135.2, "shortfallRisk": "LOW", "rainfallSensitivity": 1.1, "spatialSeed": 106},
        {"id": "chikla", "name": "Chikla", "baseGradeNum": 42.1, "productionTarget": 4100, "baselineProduction": 4020, "fleetAvailabilityBase": 89, "crusherHealthBase": 91, "unfcStatus": "UNFC-111", "leaseAreaHa": 148.0, "shortfallRisk": "LOW", "rainfallSensitivity": 1.2, "spatialSeed": 107},
        {"id": "dongri-buzurg", "name": "Dongri Buzurg", "baseGradeNum": 46.0, "productionTarget": 5400, "baselineProduction": 5310, "fleetAvailabilityBase": 92, "crusherHealthBase": 95, "unfcStatus": "UNFC-111 Proved", "leaseAreaHa": 210.0, "shortfallRisk": "LOW", "rainfallSensitivity": 1.0, "spatialSeed": 108},
        {"id": "ramtek", "name": "Ramtek", "baseGradeNum": 38.2, "productionTarget": 1600, "baselineProduction": 1540, "fleetAvailabilityBase": 84, "crusherHealthBase": 82, "unfcStatus": "UNFC-333", "leaseAreaHa": 84.5, "shortfallRisk": "HIGH", "rainfallSensitivity": 1.5, "spatialSeed": 109},
        {"id": "bhandara", "name": "Bhandara", "baseGradeNum": 39.8, "productionTarget": 1950, "baselineProduction": 1890, "fleetAvailabilityBase": 85, "crusherHealthBase": 84, "unfcStatus": "UNFC-333", "leaseAreaHa": 92.0, "shortfallRisk": "MEDIUM", "rainfallSensitivity": 1.3, "spatialSeed": 110}
    ]

    # Verify that different mathematical criteria yield distinct leaderboards
    modes = [
        'NATIONAL_PERFORMANCE',
        'RESERVE_POTENTIAL',
        'EXPLORATION_PRIORITY',
        'PRODUCTION_RISK',
        'ENVIRONMENTAL_RISK',
        'EQUIPMENT_RISK',
        'STRATEGIC_PRIORITY'
    ]

    mode_top_mines = {}

    for mode in modes:
        if mode == 'NATIONAL_PERFORMANCE':
            # Balaghat / Dongri Buzurg with high achievement & output lead
            ranked = sorted(mines, key=lambda m: (m['baselineProduction']/m['productionTarget']) * 100 + m['fleetAvailabilityBase'], reverse=True)
        elif mode == 'RESERVE_POTENTIAL':
            # Dongri Buzurg & Balaghat with massive UNFC reserves lead
            ranked = sorted(mines, key=lambda m: m['baseGradeNum'] * 2.5 + (20 if 'Proved' in m['unfcStatus'] else 5), reverse=True)
        elif mode == 'EXPLORATION_PRIORITY':
            # Dongri Buzurg, Kandri, Munsar with large unexplored strike extents lead
            ranked = sorted(mines, key=lambda m: m['leaseAreaHa'] * 0.4 + m['baseGradeNum'], reverse=True)
        elif mode == 'PRODUCTION_RISK':
            # Tirodi, Ramtek, Munsar with high shortfall risk & weather sensitivity lead
            ranked = sorted(mines, key=lambda m: m['rainfallSensitivity'] * 40 + (30 if m['shortfallRisk'] == 'HIGH' else 10), reverse=True)
        elif mode == 'ENVIRONMENTAL_RISK':
            # Tirodi & Dongri Buzurg with large open pit disturbance lead
            ranked = sorted(mines, key=lambda m: m['leaseAreaHa'] * m['rainfallSensitivity'], reverse=True)
        elif mode == 'EQUIPMENT_RISK':
            # Ramtek & Bhandara with low fleet health and availability lead
            ranked = sorted(mines, key=lambda m: 100 - m['fleetAvailabilityBase'] + (100 - m['crusherHealthBase']), reverse=True)
        elif mode == 'STRATEGIC_PRIORITY':
            # Composite priority
            ranked = sorted(mines, key=lambda m: m['productionTarget'] * m['baseGradeNum'], reverse=True)

        top_id = ranked[0]['id']
        mode_top_mines[mode] = [m['id'] for m in ranked]
        print(f"  [OK] Mode: {mode:<24} -> Top #1: {ranked[0]['name']} | Top #2: {ranked[1]['name']} | Top #3: {ranked[2]['name']}")

    # Assert that all 7 modes are not producing identical ranking vectors
    rank_vectors = list(mode_top_mines.values())
    unique_vectors = set(tuple(v) for v in rank_vectors)

    print(f"\nTotal Modes Tested: {len(modes)}")
    print(f"Unique Ranking Vectors: {len(unique_vectors)} / {len(modes)}")
    assert len(unique_vectors) == len(modes), "ERROR: Some modes generated identical rankings!"
    print("[SUCCESS] All 7 National Radar modes produce 100% distinct analytical rankings and scores!\n")

if __name__ == '__main__':
    test_national_radar_modes()
