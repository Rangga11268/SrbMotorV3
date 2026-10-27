import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'api_constants.dart';

class ApiResponse<T> {
  final bool isSuccess;
  final T? data;
  final String? message;
  final int? statusCode;

  ApiResponse({
    required this.isSuccess,
    this.data,
    this.message,
    this.statusCode,
  });

  factory ApiResponse.success(T data, {String? message, int? statusCode}) {
    return ApiResponse(
      isSuccess: true,
      data: data,
      message: message,
      statusCode: statusCode,
    );
  }

  factory ApiResponse.error(String message, {int? statusCode}) {
    return ApiResponse(
      isSuccess: false,
      message: message,
      statusCode: statusCode,
    );
  }
}

class ApiService {
  static const Duration _timeout = Duration(seconds: 12);

  static Map<String, String> _headers([String? token]) {
    final headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  // Auth: Login
  static Future<ApiResponse<Map<String, dynamic>>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse(ApiConstants.login),
            headers: _headers(),
            body: jsonEncode({'email': email, 'password': password}),
          )
          .timeout(_timeout);

      final body = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return ApiResponse.success(body as Map<String, dynamic>);
      } else {
        final message = body['message'] ?? 'Login gagal. Periksa kembali kredensial Anda.';
        return ApiResponse.error(message.toString(), statusCode: response.statusCode);
      }
    } on SocketException {
      return ApiResponse.error('Tidak dapat terhubung ke server backend.');
    } on TimeoutException {
      return ApiResponse.error('Koneksi timeout. Pastikan server backend menyala.');
    } catch (e) {
      return ApiResponse.error('Terjadi kesalahan: $e');
    }
  }

  // Auth: Register
  static Future<ApiResponse<Map<String, dynamic>>> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse(ApiConstants.register),
            headers: _headers(),
            body: jsonEncode({
              'name': name,
              'email': email,
              'phone': phone,
              'password': password,
              'password_confirmation': password,
            }),
          )
          .timeout(_timeout);

      final body = jsonDecode(response.body);

      if (response.statusCode == 201 || response.statusCode == 200) {
        return ApiResponse.success(body as Map<String, dynamic>);
      } else {
        final message = body['message'] ?? 'Pendaftaran gagal.';
        return ApiResponse.error(message.toString(), statusCode: response.statusCode);
      }
    } on SocketException {
      return ApiResponse.error('Tidak dapat terhubung ke server backend.');
    } on TimeoutException {
      return ApiResponse.error('Koneksi timeout.');
    } catch (e) {
      return ApiResponse.error('Terjadi kesalahan: $e');
    }
  }

  // Auth: Get Current User Profile
  static Future<ApiResponse<Map<String, dynamic>>> getUserProfile(String token) async {
    try {
      final response = await http
          .get(Uri.parse(ApiConstants.userProfile), headers: _headers(token))
          .timeout(_timeout);

      final body = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return ApiResponse.success(body as Map<String, dynamic>);
      } else {
        return ApiResponse.error('Gagal memuat profil pengguna.', statusCode: response.statusCode);
      }
    } catch (e) {
      return ApiResponse.error('Error memuat profil: $e');
    }
  }

  // Auth: Update Profile
  static Future<ApiResponse<Map<String, dynamic>>> updateProfile(
    String token, {
    required String name,
    String? phone,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse(ApiConstants.updateProfile),
            headers: _headers(token),
            body: jsonEncode({
              'name': name,
              'phone': phone,
            }),
          )
          .timeout(_timeout);

      final body = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return ApiResponse.success(body as Map<String, dynamic>);
      } else {
        final message = body['message'] ?? 'Gagal memperbarui profil.';
        return ApiResponse.error(message.toString(), statusCode: response.statusCode);
      }
    } catch (e) {
      return ApiResponse.error('Terjadi kesalahan saat menyimpan profil: $e');
    }
  }

  // Auth: Logout
  static Future<void> logout(String token) async {
    try {
      await http
          .post(Uri.parse(ApiConstants.logout), headers: _headers(token))
          .timeout(const Duration(seconds: 4));
    } catch (_) {}
  }

  // Motors: Get List with optional search / filter
  static Future<ApiResponse<List<dynamic>>> getMotors({
    String? brand,
    String? search,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (brand != null && brand.isNotEmpty && brand != 'Semua') {
        queryParams['brand'] = brand;
      }
      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }

      final uri = Uri.parse(ApiConstants.motors).replace(queryParameters: queryParams.isEmpty ? null : queryParams);
      final response = await http.get(uri, headers: _headers()).timeout(_timeout);

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        List<dynamic> list = [];
        if (body is List) {
          list = body;
        } else if (body is Map && body['data'] is List) {
          list = body['data'];
        }
        return ApiResponse.success(list);
      } else {
        return ApiResponse.error('Gagal mengambil data katalog motor.', statusCode: response.statusCode);
      }
    } on SocketException {
      return ApiResponse.error('Koneksi jaringan gagal. Periksa koneksi ke server.');
    } catch (e) {
      return ApiResponse.error('Error: $e');
    }
  }

  // Motors: Get Detail by ID
  static Future<ApiResponse<Map<String, dynamic>>> getMotorDetail(int id) async {
    try {
      final response = await http
          .get(Uri.parse('${ApiConstants.motors}/$id'), headers: _headers())
          .timeout(_timeout);

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final data = body is Map && body.containsKey('data') ? body['data'] : body;
        return ApiResponse.success(data as Map<String, dynamic>);
      } else {
        return ApiResponse.error('Detail motor tidak ditemukan.', statusCode: response.statusCode);
      }
    } catch (e) {
      return ApiResponse.error('Error: $e');
    }
  }

  // Orders: Get User Orders
  static Future<ApiResponse<List<dynamic>>> getUserOrders(String token) async {
    try {
      final response = await http
          .get(Uri.parse(ApiConstants.orders), headers: _headers(token))
          .timeout(_timeout);

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        List<dynamic> list = [];
        if (body is List) {
          list = body;
        } else if (body is Map && body['data'] is List) {
          list = body['data'];
        }
        return ApiResponse.success(list);
      } else {
        return ApiResponse.error('Gagal mengambil data transaksi.', statusCode: response.statusCode);
      }
    } catch (e) {
      return ApiResponse.error('Error memuat transaksi: $e');
    }
  }
}
