import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'models/motor.dart';
import 'models/user.dart';
import 'models/order.dart';
import 'services/api_service.dart';

class AppState extends ChangeNotifier {
  late SharedPreferences _prefs;
  User? _currentUser;
  String? _token;
  List<int> _wishlist = [];
  bool _isInitialized = false;

  // Motors state
  List<Motor> _motors = [];
  bool _isLoadingMotors = false;
  String? _motorError;

  // Orders state
  List<Order> _orders = [];
  bool _isLoadingOrders = false;
  String? _orderError;

  // Getters
  User? get currentUser => _currentUser;
  User? get user => _currentUser;
  String? get token => _token;
  bool get isAuthenticated => _token != null && _currentUser != null;
  bool get isLoggedIn => isAuthenticated;
  List<int> get wishlist => _wishlist;
  bool get isInitialized => _isInitialized;

  List<Motor> get motors => _motors.isNotEmpty ? _motors : motorList;
  bool get isLoadingMotors => _isLoadingMotors;
  String? get motorError => _motorError;

  List<Order> get orders => _orders;
  bool get isLoadingOrders => _isLoadingOrders;
  String? get orderError => _orderError;

  // Initialize SharedPreferences, restore session, and fetch initial data
  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    _loadWishlist();
    await _checkExistingSession();
    _isInitialized = true;
    notifyListeners();

    // Fetch initial dynamic motors
    fetchMotors();
    if (isAuthenticated) {
      fetchOrders();
      fetchWishlist();
    }
  }

  void _loadWishlist() {
    final wishlistJson = _prefs.getStringList('wishlist') ?? [];
    _wishlist = wishlistJson.map((id) => int.tryParse(id) ?? 0).where((id) => id > 0).toList();
  }

  Future<void> fetchWishlist() async {
    if (_token == null || _token!.isEmpty) return;
    final res = await ApiService.getWishlist(_token!);
    if (res.isSuccess && res.data != null) {
      final set = <int>{..._wishlist, ...res.data!};
      _wishlist = set.toList();
      await _prefs.setStringList('wishlist', _wishlist.map((id) => id.toString()).toList());
      notifyListeners();
    }
  }

  // Restore session from token
  Future<void> _checkExistingSession() async {
    _token = _prefs.getString('auth_token');
    final userId = _prefs.getString('userId');
    final userName = _prefs.getString('userName');
    final userEmail = _prefs.getString('userEmail');
    final userPhone = _prefs.getString('userPhone');

    if (userId != null && userName != null && userEmail != null) {
      _currentUser = User(
        id: userId,
        name: userName,
        email: userEmail,
        phone: userPhone ?? '-',
      );
    }

    // If token exists, verify with backend profile
    if (_token != null && _token!.isNotEmpty) {
      final res = await ApiService.getUserProfile(_token!);
      if (res.isSuccess && res.data != null) {
        final dynamic rawUser = res.data!['data'] ?? res.data!['user'] ?? res.data!;
        if (rawUser is Map<String, dynamic>) {
          _currentUser = User.fromJson(rawUser);
          await _saveUserToPrefs(_currentUser!);
        }
      } else if (res.statusCode == 401) {
        // Token expired
        await logout();
      }
    }
  }

  Future<void> _saveUserToPrefs(User user) async {
    await _prefs.setString('userId', user.id);
    await _prefs.setString('userName', user.name);
    await _prefs.setString('userEmail', user.email);
    await _prefs.setString('userPhone', user.phone);
  }

  // Real login via REST API
  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await ApiService.login(email: email, password: password);
    if (res.isSuccess && res.data != null) {
      final token = res.data!['token'] ?? res.data!['access_token'];
      final dynamic rawUser = res.data!['data'] ?? res.data!['user'];

      if (token != null && rawUser != null && rawUser is Map<String, dynamic>) {
        _token = token.toString();
        _currentUser = User.fromJson(rawUser);

        await _prefs.setString('auth_token', _token!);
        await _saveUserToPrefs(_currentUser!);

        notifyListeners();
        fetchOrders();
        fetchWishlist();
        return {'success': true};
      }
    }

    return {
      'success': false,
      'message': res.message ?? 'Login gagal. Periksa kembali email dan password.',
    };
  }

  // Real registration via REST API
  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    final res = await ApiService.register(
      name: name,
      email: email,
      phone: phone,
      password: password,
    );

    if (res.isSuccess && res.data != null) {
      final token = res.data!['token'] ?? res.data!['access_token'];
      final dynamic rawUser = res.data!['data'] ?? res.data!['user'];

      if (token != null && rawUser != null && rawUser is Map<String, dynamic>) {
        _token = token.toString();
        _currentUser = User.fromJson(rawUser);

        await _prefs.setString('auth_token', _token!);
        await _saveUserToPrefs(_currentUser!);

        notifyListeners();
        fetchWishlist();
        return {'success': true};
      }
      return {'success': true, 'message': 'Pendaftaran berhasil. Silakan masuk.'};
    }

    return {
      'success': false,
      'message': res.message ?? 'Pendaftaran gagal.',
    };
  }

  // Update Profile
  Future<Map<String, dynamic>> updateProfile({
    required String name,
    required String phone,
  }) async {
    if (_token != null && _token!.isNotEmpty) {
      final res = await ApiService.updateProfile(_token!, name: name, phone: phone);
      if (res.isSuccess && res.data != null) {
        final dynamic rawUser = res.data!['data'] ?? res.data!['user'] ?? res.data!;
        if (rawUser is Map<String, dynamic>) {
          _currentUser = User.fromJson(rawUser);
        } else {
          _currentUser = User(
            id: _currentUser?.id ?? '',
            name: name,
            email: _currentUser?.email ?? '',
            phone: phone,
            role: _currentUser?.role,
            avatarUrl: _currentUser?.avatarUrl,
          );
        }
        await _saveUserToPrefs(_currentUser!);
        notifyListeners();
        return {'success': true, 'message': res.data!['message'] ?? 'Profil berhasil diperbarui'};
      }
      return {
        'success': false,
        'message': res.message ?? 'Gagal memperbarui profil.',
      };
    } else if (_currentUser != null) {
      _currentUser = User(
        id: _currentUser!.id,
        name: name,
        email: _currentUser!.email,
        phone: phone,
        role: _currentUser!.role,
        avatarUrl: _currentUser!.avatarUrl,
      );
      await _saveUserToPrefs(_currentUser!);
      notifyListeners();
      return {'success': true, 'message': 'Profil berhasil disimpan secara lokal.'};
    }
    return {'success': false, 'message': 'Pengguna tidak ditemukan.'};
  }

  // Logout
  Future<void> logout() async {
    if (_token != null) {
      await ApiService.logout(_token!);
    }
    _token = null;
    _currentUser = null;
    _orders = [];

    await _prefs.remove('auth_token');
    await _prefs.remove('userId');
    await _prefs.remove('userName');
    await _prefs.remove('userEmail');
    await _prefs.remove('userPhone');

    notifyListeners();
  }

  // Fetch motors live from backend
  Future<void> fetchMotors({String? brand, String? search}) async {
    _isLoadingMotors = true;
    _motorError = null;
    notifyListeners();

    final res = await ApiService.getMotors(brand: brand, search: search);
    _isLoadingMotors = false;

    if (res.isSuccess && res.data != null) {
      try {
        _motors = res.data!.map((item) => Motor.fromJson(item as Map<String, dynamic>)).toList();
      } catch (e) {
        _motorError = 'Gagal memproses data motor: $e';
      }
    } else {
      _motorError = res.message ?? 'Gagal memuat katalog motor.';
    }

    notifyListeners();
  }

  // Fetch user orders live
  Future<void> fetchOrders() async {
    if (_token == null) return;

    _isLoadingOrders = true;
    _orderError = null;
    notifyListeners();

    final res = await ApiService.getUserOrders(_token!);
    _isLoadingOrders = false;

    if (res.isSuccess && res.data != null) {
      try {
        _orders = res.data!.map((item) => Order.fromJson(item as Map<String, dynamic>)).toList();
      } catch (e) {
        _orderError = 'Gagal memproses riwayat pesanan: $e';
      }
    } else {
      _orderError = res.message;
    }

    notifyListeners();
  }

  // Wishlist toggle
  Future<void> toggleWishlist(int motorId) async {
    if (_wishlist.contains(motorId)) {
      _wishlist.remove(motorId);
    } else {
      _wishlist.add(motorId);
    }
    await _prefs.setStringList('wishlist', _wishlist.map((id) => id.toString()).toList());
    notifyListeners();

    if (isAuthenticated && _token != null && _token!.isNotEmpty) {
      ApiService.toggleWishlist(motorId, _token!).then((res) {
        if (res.isSuccess && res.data != null && res.data!['wishlist'] is List) {
          final serverList = (res.data!['wishlist'] as List)
              .map((id) => int.tryParse(id.toString()) ?? 0)
              .where((id) => id > 0)
              .toList();
          _wishlist = serverList;
          _prefs.setStringList('wishlist', _wishlist.map((id) => id.toString()).toList());
          notifyListeners();
        }
      });
    }
  }

  bool isInWishlist(int motorId) => _wishlist.contains(motorId);

  Future<void> clearWishlist() async {
    _wishlist.clear();
    await _prefs.remove('wishlist');
    notifyListeners();
  }

  // Order Placement
  Future<Map<String, dynamic>> submitCashOrder(Map<String, dynamic> payload) async {
    if (!isAuthenticated || _token == null) {
      return {'success': false, 'message': 'Silakan masuk ke akun Anda untuk memesan motor.'};
    }
    final res = await ApiService.createCashOrder(token: _token!, data: payload);
    if (res.isSuccess) {
      fetchOrders();
      fetchMotors();
      return {'success': true, 'message': 'Pesanan tunai berhasil dibuat!', 'data': res.data};
    }
    return {'success': false, 'message': res.message ?? 'Gagal membuat pesanan tunai.'};
  }

  Future<Map<String, dynamic>> submitCreditOrder(Map<String, dynamic> payload) async {
    if (!isAuthenticated || _token == null) {
      return {'success': false, 'message': 'Silakan masuk ke akun Anda untuk mengajukan kredit.'};
    }
    final res = await ApiService.createCreditOrder(token: _token!, data: payload);
    if (res.isSuccess) {
      fetchOrders();
      fetchMotors();
      return {'success': true, 'message': 'Pengajuan kredit berhasil dikirim!', 'data': res.data};
    }
    return {'success': false, 'message': res.message ?? 'Gagal membuat pengajuan kredit.'};
  }

  Future<Map<String, dynamic>> confirmSurveyDone(int orderId) async {
    if (!isAuthenticated || _token == null) {
      return {'success': false, 'message': 'Silakan masuk ke akun Anda.'};
    }
    final res = await ApiService.confirmSurveyDone(token: _token!, orderId: orderId);
    if (res.isSuccess) {
      await fetchOrders();
      return {'success': true, 'message': res.data?['message'] ?? 'Konfirmasi survei berhasil dicatat!'};
    }
    return {'success': false, 'message': res.message ?? 'Gagal mengonfirmasi survei.'};
  }
}
