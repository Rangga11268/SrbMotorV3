import '../services/location_service.dart';

class Branch {
  final int id;
  final String code;
  final String name;
  final String address;
  final String city;
  final String? phone;
  final bool isMainBranch;
  final double? distance;
  final double? latitude;
  final double? longitude;

  double? get distanceKm => distance;

  Branch({
    required this.id,
    required this.code,
    required this.name,
    required this.address,
    required this.city,
    this.phone,
    this.isMainBranch = false,
    this.distance,
    this.latitude,
    this.longitude,
  });

  String get formattedDistance {
    if (distance == null) return '';
    if (distance! < 1.0) {
      return '${(distance! * 1000).round()} m';
    }
    return '${distance!.toStringAsFixed(1)} km';
  }

  static List<Branch> sortByProximity(List<Branch> branches, double userLat, double userLon) {
    final list = branches.map((b) {
      if (b.latitude != null && b.longitude != null) {
        final d = LocationService.calculateDistanceKm(userLat, userLon, b.latitude!, b.longitude!);
        return b.copyWith(distance: d);
      }
      return b;
    }).toList();
    list.sort((a, b) => (a.distance ?? 999999).compareTo(b.distance ?? 999999));
    return list;
  }

  Branch copyWith({
    int? id,
    String? code,
    String? name,
    String? address,
    String? city,
    String? phone,
    bool? isMainBranch,
    double? distance,
    double? latitude,
    double? longitude,
  }) {
    return Branch(
      id: id ?? this.id,
      code: code ?? this.code,
      name: name ?? this.name,
      address: address ?? this.address,
      city: city ?? this.city,
      phone: phone ?? this.phone,
      isMainBranch: isMainBranch ?? this.isMainBranch,
      distance: distance ?? this.distance,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
    );
  }

  factory Branch.fromJson(Map<String, dynamic> json) {
    return Branch(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id']?.toString() ?? '0') ?? 0,
      code: json['code']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Cabang SRB Motor',
      address: json['address']?.toString() ?? '',
      city: json['city']?.toString() ?? 'Bekasi',
      phone: json['phone']?.toString(),
      isMainBranch: json['is_main_branch'] == true || json['is_main_branch'] == 1,
      distance: json['distance'] != null ? double.tryParse(json['distance'].toString()) : null,
      latitude: json['latitude'] != null ? double.tryParse(json['latitude'].toString()) : null,
      longitude: json['longitude'] != null ? double.tryParse(json['longitude'].toString()) : null,
    );
  }

  /// Real Branches from Database Seed / Fallback with official GPS coordinates
  static List<Branch> get defaultBranches => [
    Branch(
      id: 1,
      code: 'SSM_MEKAR_SARI',
      name: 'SSM MEKAR SARI (BEKASI)',
      address: 'Jl. Mekar Sari No.39, Bekasi Jaya, Kec. Bekasi Tim., Kota Bks',
      city: 'Bekasi',
      phone: '02189094308',
      isMainBranch: true,
      latitude: -6.22982301,
      longitude: 107.01586284,
    ),
    Branch(
      id: 2,
      code: 'SSM_JATIASIH_RSHOP',
      name: 'Yamaha Sinar Surya Matahari - Premium R-Shop',
      address: 'Jl. Raya Jatimekar No.72A, Jatimekar, Kec. Jatiasih, Kota Bks',
      city: 'Bekasi',
      phone: '02184972828',
      isMainBranch: false,
      latitude: -6.28729282,
      longitude: 106.95384886,
    ),
    Branch(
      id: 3,
      code: 'SRB_KALIABANG',
      name: 'SRB Motors Kaliabang',
      address: 'Jl. Lori Sakti No.22, Kaliabang Tengah, Kec. Bekasi Utara, Kota Bks',
      city: 'Bekasi',
      phone: '08978638849',
      isMainBranch: false,
      latitude: -6.20129849,
      longitude: 107.00251372,
    ),
    Branch(
      id: 4,
      code: 'SSM_PONDOK_UNGU',
      name: 'SSM Pondok Ungu',
      address: 'Jl. Raya Pd. Ungu Permai Blok II 10 No.86, Kaliabang Tengah, Kec. Bekasi Utara',
      city: 'Bekasi',
      isMainBranch: false,
      latitude: -6.17860063,
      longitude: 107.00491698,
    ),
    Branch(
      id: 5,
      code: 'SSM_ALINDA',
      name: 'SSM Yamaha Alinda',
      address: 'Jl. Alinda, Kaliabang Tengah, Kec. Bekasi Utara, Kota Bks',
      city: 'Bekasi',
      phone: '08971756468',
      isMainBranch: false,
      latitude: -6.19101224,
      longitude: 107.00606014,
    ),
    Branch(
      id: 6,
      code: 'SSM_JATIBENING',
      name: 'Dealer Resmi Yamaha SSM Motor Jatibening',
      address: 'Jatibening, Kec. Pd. Gede, Kota Bks',
      city: 'Bekasi',
      phone: '0895383002103',
      isMainBranch: false,
      latitude: -6.25780485,
      longitude: 106.95166736,
    ),
  ];
}
