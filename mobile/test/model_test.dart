import 'package:flutter_test/flutter_test.dart';
import 'package:srb_motor_app/models/motor.dart';
import 'package:srb_motor_app/models/order.dart';
import 'package:srb_motor_app/models/user.dart';
import 'package:srb_motor_app/services/api_constants.dart';

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
}
