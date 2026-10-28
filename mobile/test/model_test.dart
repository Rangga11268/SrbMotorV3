import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:srb_motor_app/models/branch.dart';
import 'package:srb_motor_app/models/motor.dart';
import 'package:srb_motor_app/models/order.dart';
import 'package:srb_motor_app/models/user.dart';
import 'package:srb_motor_app/services/api_constants.dart';
import 'package:srb_motor_app/services/location_service.dart';
import 'package:srb_motor_app/widgets/app_button.dart';
import 'package:srb_motor_app/widgets/app_color_selector.dart';

void main() {
  test('Motor.fromJson parses API response and resolves image URL correctly', () {
    final json = {
      'id': 1,
      'name': 'Yamaha NMAX Turbo 2024',
      'brand': 'Yamaha',
      'model': 'NMAX',
      'price': 35500000,
      'year': 2024,
      'type': 'Matic',
      'image_path': 'assets/img/yamaha/NMax_Turbo.webp',
      'image': 'http://127.0.0.1:8000/assets/img/yamaha/NMax_Turbo.webp',
      'colors': '["Hitam", "Putih"]',
      'stock': 5,
      'tersedia': true,
      'min_dp_amount': 3500000,
    };

    final motor = Motor.fromJson(json);

    expect(motor.id, 1);
    expect(motor.name, 'Yamaha NMAX Turbo 2024');
    expect(motor.brand, 'Yamaha');
    expect(motor.price, 35500000.0);
    expect(motor.colors, ['Hitam', 'Putih']);
    expect(motor.isAvailable, true);
    expect(motor.stock, 5);
    expect(motor.formattedPrice, contains('35.500.000'));
  });

  test('ApiConstants.resolveImageUrl correctly formats asset and storage paths', () {
    final assetPath = 'assets/img/yamaha/NMax_Turbo.webp';
    final resolved = ApiConstants.resolveImageUrl(assetPath);
    expect(resolved, contains('/assets/img/yamaha/NMax_Turbo.webp'));

    final storagePath = 'motors/abc.webp';
    final resolvedStorage = ApiConstants.resolveImageUrl(storagePath);
    expect(resolvedStorage, contains('/storage/motors/abc.webp'));
  });

  test('Order.fromJson parses transaction details properly', () {
    final orderJson = {
      'id': 10,
      'order_number': 'TRX-2026-001',
      'transaction_type': 'CREDIT',
      'status': 'APPROVED',
      'total_amount': 35500000,
      'dp_amount': 5000000,
      'tenor': 36,
      'angsuran_per_bulan': 1250000,
      'created_at': '2026-10-27T10:00:00Z',
    };

    final order = Order.fromJson(orderJson);

    expect(order.id, 10);
    expect(order.orderNumber, 'TRX-2026-001');
    expect(order.transactionType, 'CREDIT');
    expect(order.status, 'APPROVED');
    expect(order.statusLabel, 'Disetujui');
    expect(order.dpAmount, 5000000.0);

    final surveyOrder = Order.fromJson({...orderJson, 'status': 'SURVEY_SCHEDULED'});
    expect(surveyOrder.statusLabel, 'Jadwal Survei');

    final waitingOrder = Order.fromJson({...orderJson, 'status': 'MENUNGGU_PERSETUJUAN'});
    expect(waitingOrder.statusLabel, 'Menunggu Persetujuan');
  });

  test('User.fromJson correctly parses backend Auth API payload', () {
    final backendPayload = {
      'id': 2,
      'name': 'Regular User',
      'email': 'user@srbmotors.com',
      'role': 'user',
      'phone': '08123456789',
      'profile_photo_url': null,
    };

    final user = User.fromJson(backendPayload);

    expect(user.id, '2');
    expect(user.name, 'Regular User');
    expect(user.email, 'user@srbmotors.com');
    expect(user.phone, '08123456789');
    expect(user.role, 'user');

    final updatedMap = user.toJson();
    expect(updatedMap['name'], 'Regular User');
    expect(updatedMap['phone'], '08123456789');
  });

  test('Branch.fromJson and distance formatting parses coordinates and computes distance correctly', () {
    final branchJson = {
      'id': 6,
      'code': 'SSM_JATIBENING',
      'name': 'Dealer Resmi Yamaha SSM Motor Jatibening',
      'address': 'Jatibening, Kec. Pd. Gede, Kota Bks',
      'city': 'Bekasi',
      'phone': '0895383002103',
      'is_main_branch': false,
      'latitude': -6.25780485,
      'longitude': 106.95166736,
      'distance': 3.43,
    };

    final branch = Branch.fromJson(branchJson);
    expect(branch.code, 'SSM_JATIBENING');
    expect(branch.latitude, -6.25780485);
    expect(branch.longitude, 106.95166736);
    expect(branch.distance, 3.43);
    expect(branch.formattedDistance, '3.4 km');

    // Test distance calculation helper between user and branch
    final userLat = -6.2382;
    final userLon = 106.9756;
    final distKm = LocationService.calculateDistanceKm(
      userLat,
      userLon,
      branch.latitude!,
      branch.longitude!,
    );
    expect(distKm, greaterThan(3.0));
    expect(distKm, lessThan(4.0));
  });

  testWidgets('AppButton renders properly with glossy styling and triggers callback', (tester) async {
    bool tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: AppButton.primary(
            text: 'Lanjutkan',
            icon: Icons.arrow_forward_rounded,
            onPressed: () => tapped = true,
          ),
        ),
      ),
    );

    expect(find.text('Lanjutkan'), findsOneWidget);
    expect(find.byIcon(Icons.arrow_forward_rounded), findsOneWidget);

    await tester.tap(find.text('Lanjutkan'));
    await tester.pump();
    expect(tapped, true);
  });

  testWidgets('AppColorSelector renders metallic swatches and handles selection', (tester) async {
    String selected = 'Hitam';

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatefulBuilder(
            builder: (context, setState) => AppColorSelector(
              colors: const ['Hitam', 'Putih', 'Merah', 'Biru Matte'],
              selectedColor: selected,
              onColorSelected: (val) => setState(() => selected = val),
            ),
          ),
        ),
      ),
    );

    expect(find.text('Hitam'), findsWidgets);
    expect(find.text('Biru Matte'), findsWidgets);

    await tester.tap(find.text('Biru Matte').first);
    await tester.pump();
    expect(selected, 'Biru Matte');
  });
}
