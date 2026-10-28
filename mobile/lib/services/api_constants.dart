import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiConstants {
  // Override this if testing on physical phone on the same Wi-Fi (e.g. 'http://192.168.1.10:8000')
  static String? customHost;

  static String get host {
    if (customHost != null && customHost!.isNotEmpty) {
      return customHost!;
    }
    if (kIsWeb) return 'http://127.0.0.1:8000';
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:8000';
      }
    } catch (_) {}
    return 'http://127.0.0.1:8000';
  }

  static String get baseUrl => '$host/api';

  // Endpoints
  static String get login => '$baseUrl/login';
  static String get register => '$baseUrl/register';
  static String get logout => '$baseUrl/logout';
  static String get userProfile => '$baseUrl/user';
  static String get updateProfile => '$baseUrl/profile';
  static String get motors => '$baseUrl/motors';
  static String get orders => '$baseUrl/orders';
  static String get cashOrder => '$baseUrl/orders/cash';
  static String get creditOrder => '$baseUrl/orders/credit';
  static String confirmSurvey(int orderId) => '$baseUrl/orders/$orderId/confirm-survey-done';
  static String get branches => '$baseUrl/branches';
  static String get branchesWithDistance => '$baseUrl/branches/with-distance';
  static String get nearestBranch => '$baseUrl/branches/nearest';
  static String get wishlist => '$baseUrl/wishlist';
  static String get toggleWishlist => '$baseUrl/wishlist/toggle';

  // Resolver to ensure images resolve cleanly across Emulator and Web/Desktop
  static String resolveImageUrl(String? path) {
    if (path == null || path.isEmpty) {
      return '';
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      if (!kIsWeb) {
        try {
          if (Platform.isAndroid && (path.contains('127.0.0.1') || path.contains('localhost'))) {
            return path.replaceFirst('127.0.0.1', '10.0.2.2').replaceFirst('localhost', '10.0.2.2');
          }
        } catch (_) {}
      }
      return path;
    }
    final cleanPath = path.startsWith('/') ? path.substring(1) : path;
    if (cleanPath.startsWith('assets/')) {
      return '$host/$cleanPath';
    }
    return '$host/storage/$cleanPath';
  }
}
