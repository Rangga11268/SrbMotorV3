import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'api_constants.dart';
import '../models/branch.dart';

class ApiResponse<T> {
  final bool isSuccess;
  final T? data;
  final String? message;
  final int? statusCode;

  String? get errorMessage => message;

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

  // Branches: Get Active Branches from Database (optionally sorted by distance with GPS coordinates)
  static Future<ApiResponse<List<Branch>>> getBranches({double? latitude, double? longitude}) async {
    try {
      final uri = (latitude != null && longitude != null)
          ? Uri.parse('${ApiConstants.branchesWithDistance}?latitude=$latitude&longitude=$longitude')
          : Uri.parse(ApiConstants.branches);

      final response = await http
          .get(uri, headers: _headers())
          .timeout(_timeout);

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final rawList = body['data'] ?? body['branches'];
        final list = (rawList as List?)
                ?.map((e) => Branch.fromJson(e as Map<String, dynamic>))
                .toList() ??
            [];
        return ApiResponse.success(list);
      } else {
        return ApiResponse.error('Gagal mengambil data cabang.');
      }
    } catch (e) {
      return ApiResponse.error('Error memuat cabang: $e');
    }
  }

  // Branches: Get single nearest branch based on GPS location
  static Future<ApiResponse<Branch>> findNearestBranch(double latitude, double longitude) async {
    try {
      final uri = Uri.parse('${ApiConstants.nearestBranch}?latitude=$latitude&longitude=$longitude');
      final response = await http
          .get(uri, headers: _headers())
          .timeout(_timeout);

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        if (body['success'] == true && body['branch'] != null) {
          return ApiResponse.success(Branch.fromJson(body['branch']));
        }
      }
      return ApiResponse.error('Cabang terdekat tidak ditemukan.');
    } catch (e) {
      return ApiResponse.error('Error mencari cabang terdekat: $e');
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

  // Wishlist: Get User Wishlist IDs
  static Future<ApiResponse<List<int>>> getWishlist(String token) async {
    try {
      final response = await http
          .get(Uri.parse(ApiConstants.wishlist), headers: _headers(token))
          .timeout(_timeout);

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final list = (body['wishlist'] as List?)
                ?.map((id) => int.tryParse(id.toString()) ?? 0)
                .where((id) => id > 0)
                .toList() ??
            [];
        return ApiResponse.success(list);
      } else {
        return ApiResponse.error('Gagal mengambil data wishlist.', statusCode: response.statusCode);
      }
    } catch (e) {
      return ApiResponse.error('Error memuat wishlist: $e');
    }
  }

  // Wishlist: Toggle Motor
  static Future<ApiResponse<Map<String, dynamic>>> toggleWishlist(int motorId, String token) async {
    try {
      final response = await http
          .post(
            Uri.parse(ApiConstants.toggleWishlist),
            headers: _headers(token),
            body: jsonEncode({'motor_id': motorId}),
          )
          .timeout(_timeout);

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        return ApiResponse.success(body as Map<String, dynamic>);
      } else {
        return ApiResponse.error('Gagal memperbarui wishlist.', statusCode: response.statusCode);
      }
    } catch (e) {
      return ApiResponse.error('Error toggle wishlist: $e');
    }
  }

  // Order: Create Cash Order
  static Future<ApiResponse<Map<String, dynamic>>> createCashOrder({
    required String token,
    required Map<String, dynamic> data,
    String? ktpFilePath,
    String? kkFilePath,
  }) async {
    try {
      if (ktpFilePath != null || kkFilePath != null) {
        final request = http.MultipartRequest('POST', Uri.parse(ApiConstants.cashOrder));
        request.headers.addAll({
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        });
        data.forEach((key, value) {
          if (value != null) {
            request.fields[key] = value.toString();
          }
        });
        if (ktpFilePath != null && ktpFilePath.isNotEmpty) {
          request.files.add(await http.MultipartFile.fromPath('ktp_image', ktpFilePath));
        }
        if (kkFilePath != null && kkFilePath.isNotEmpty) {
          request.files.add(await http.MultipartFile.fromPath('kk_image', kkFilePath));
        }
        final streamedResponse = await request.send().timeout(_timeout);
        final response = await http.Response.fromStream(streamedResponse);
        final body = jsonDecode(response.body);
        if (response.statusCode == 200 || response.statusCode == 201) {
          return ApiResponse.success(body as Map<String, dynamic>);
        } else {
          return ApiResponse.error(
            body['message'] ?? 'Gagal membuat pesanan tunai.',
            statusCode: response.statusCode,
          );
        }
      }

      final response = await http
          .post(
            Uri.parse(ApiConstants.cashOrder),
            headers: _headers(token),
            body: jsonEncode(data),
          )
          .timeout(_timeout);

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 || response.statusCode == 201) {
        return ApiResponse.success(body as Map<String, dynamic>);
      } else {
        return ApiResponse.error(
          body['message'] ?? 'Gagal membuat pesanan tunai.',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse.error('Error membuat pesanan: $e');
    }
  }

  // Order: Create Credit Order
  static Future<ApiResponse<Map<String, dynamic>>> createCreditOrder({
    required String token,
    required Map<String, dynamic> data,
    String? ktpFilePath,
    String? kkFilePath,
  }) async {
    try {
      if (ktpFilePath != null || kkFilePath != null) {
        final request = http.MultipartRequest('POST', Uri.parse(ApiConstants.creditOrder));
        request.headers.addAll({
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        });
        data.forEach((key, value) {
          if (value != null) {
            request.fields[key] = value.toString();
          }
        });
        if (ktpFilePath != null && ktpFilePath.isNotEmpty) {
          request.files.add(await http.MultipartFile.fromPath('ktp_image', ktpFilePath));
        }
        if (kkFilePath != null && kkFilePath.isNotEmpty) {
          request.files.add(await http.MultipartFile.fromPath('kk_image', kkFilePath));
        }
        final streamedResponse = await request.send().timeout(_timeout);
        final response = await http.Response.fromStream(streamedResponse);
        final body = jsonDecode(response.body);
        if (response.statusCode == 200 || response.statusCode == 201) {
          return ApiResponse.success(body as Map<String, dynamic>);
        } else {
          return ApiResponse.error(
            body['message'] ?? 'Gagal membuat pengajuan kredit.',
            statusCode: response.statusCode,
          );
        }
      }

      final response = await http
          .post(
            Uri.parse(ApiConstants.creditOrder),
            headers: _headers(token),
            body: jsonEncode(data),
          )
          .timeout(_timeout);

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 || response.statusCode == 201) {
        return ApiResponse.success(body as Map<String, dynamic>);
      } else {
        return ApiResponse.error(
          body['message'] ?? 'Gagal membuat pengajuan kredit.',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse.error('Error mengajukan kredit: $e');
    }
  }

  // Order: Confirm Survey Done by Customer
  static Future<ApiResponse<Map<String, dynamic>>> confirmSurveyDone({
    required String token,
    required int orderId,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('${ApiConstants.orders}/$orderId/confirm-survey-done'),
            headers: _headers(token),
          )
          .timeout(_timeout);

      final body = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return ApiResponse.success(body as Map<String, dynamic>);
      } else {
        return ApiResponse.error(
          body['message'] ?? 'Gagal mengonfirmasi survei.',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse.error('Error konfirmasi survei: $e');
    }
  }

  // Service: Get User Service Appointments
  static Future<ApiResponse<List<dynamic>>> getUserServices(String token) async {
    try {
      final response = await http
          .get(
            Uri.parse(ApiConstants.services),
            headers: _headers(token),
          )
          .timeout(_timeout);

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        if (body is List) {
          return ApiResponse.success(body);
        }
        return ApiResponse.success([]);
      } else {
        return ApiResponse.error('Gagal mengambil daftar reservasi servis.', statusCode: response.statusCode);
      }
    } catch (e) {
      return ApiResponse.error('Error koneksi layanan servis: $e');
    }
  }

  // Service: Create New Booking
  static Future<ApiResponse<Map<String, dynamic>>> bookService({
    required String token,
    required Map<String, dynamic> data,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse(ApiConstants.bookService),
            headers: _headers(token),
            body: jsonEncode(data),
          )
          .timeout(_timeout);

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 || response.statusCode == 201) {
        return ApiResponse.success(body as Map<String, dynamic>);
      } else {
        return ApiResponse.error(
          body['message'] ?? 'Gagal membuat antrean servis.',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse.error('Error membuat reservasi servis: $e');
    }
  }

  // Service: Get Available Slots
  static Future<ApiResponse<List<String>>> getAvailableSlots({
    required String branch,
    required String date,
  }) async {
    try {
      final uri = Uri.parse(ApiConstants.serviceAvailableSlots).replace(
        queryParameters: {'branch': branch, 'date': date},
      );
      final response = await http.get(uri, headers: _headers()).timeout(_timeout);

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        if (body is Map && body['available_slots'] is List) {
          final list = (body['available_slots'] as List).map((e) => e.toString()).toList();
          return ApiResponse.success(list);
        } else if (body is List) {
          final list = body.map((e) => e.toString()).toList();
          return ApiResponse.success(list);
        }
        return ApiResponse.success(['08:30', '09:30', '10:30', '11:30', '13:30', '14:30', '15:30']);
      } else {
        // Fallback default operational slots
        return ApiResponse.success(['08:30', '09:30', '10:30', '11:30', '13:30', '14:30', '15:30']);
      }
    } catch (_) {
      // Fallback default operational slots if offline
      return ApiResponse.success(['08:30', '09:30', '10:30', '11:30', '13:30', '14:30', '15:30']);
    }
  }

  // Service: Cancel Appointment
  static Future<ApiResponse<Map<String, dynamic>>> cancelService({
    required String token,
    required int serviceId,
    String? reason,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse(ApiConstants.cancelService(serviceId)),
            headers: _headers(token),
            body: jsonEncode({'reason': reason ?? 'Dibatalkan oleh pelanggan via Mobile App.'}),
          )
          .timeout(_timeout);

      final body = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return ApiResponse.success(body as Map<String, dynamic>);
      } else {
        return ApiResponse.error(
          body['message'] ?? 'Gagal membatalkan reservasi.',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse.error('Error membatalkan servis: $e');
    }
  }
}
