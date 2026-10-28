class Branch {
  final int id;
  final String code;
  final String name;
  final String address;
  final String city;
  final String? phone;
  final bool isMainBranch;

  Branch({
    required this.id,
    required this.code,
    required this.name,
    required this.address,
    required this.city,
    this.phone,
    this.isMainBranch = false,
  });

  factory Branch.fromJson(Map<String, dynamic> json) {
    return Branch(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id']?.toString() ?? '0') ?? 0,
      code: json['code']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Cabang SRB Motor',
      address: json['address']?.toString() ?? '',
      city: json['city']?.toString() ?? 'Bekasi',
      phone: json['phone']?.toString(),
      isMainBranch: json['is_main_branch'] == true || json['is_main_branch'] == 1,
    );
  }

  /// Real Branches from Database Seed / Fallback
  static List<Branch> get defaultBranches => [
    Branch(
      id: 1,
      code: 'SSM_MEKAR_SARI',
      name: 'SSM MEKAR SARI (BEKASI)',
      address: 'Jl. Mekar Sari No.39, Bekasi Jaya, Kec. Bekasi Tim., Kota Bks',
      city: 'Bekasi',
      phone: '02189094308',
      isMainBranch: true,
    ),
    Branch(
      id: 2,
      code: 'SSM_JATIASIH_RSHOP',
      name: 'Yamaha Sinar Surya Matahari - Premium R-Shop',
      address: 'Jl. Raya Jatimekar No.72A, Jatimekar, Kec. Jatiasih, Kota Bks',
      city: 'Bekasi',
      phone: '02184972828',
      isMainBranch: false,
    ),
    Branch(
      id: 3,
      code: 'SRB_KALIABANG',
      name: 'SRB Motors Kaliabang',
      address: 'Jl. Lori Sakti No.22, Kaliabang Tengah, Kec. Bekasi Utara, Kota Bks',
      city: 'Bekasi',
      phone: '08978638849',
      isMainBranch: false,
    ),
    Branch(
      id: 4,
      code: 'SSM_PONDOK_UNGU',
      name: 'SSM Pondok Ungu',
      address: 'Jl. Raya Pd. Ungu Permai Blok II 10 No.86, Kaliabang Tengah, Kec. Bekasi Utara',
      city: 'Bekasi',
      isMainBranch: false,
    ),
    Branch(
      id: 5,
      code: 'SSM_ALINDA',
      name: 'SSM Yamaha Alinda',
      address: 'Jl. Alinda, Kaliabang Tengah, Kec. Bekasi Utara, Kota Bks',
      city: 'Bekasi',
      phone: '08971756468',
      isMainBranch: false,
    ),
    Branch(
      id: 6,
      code: 'SSM_JATIBENING',
      name: 'Dealer Resmi Yamaha SSM Motor Jatibening',
      address: 'Jatibening, Kec. Pd. Gede, Kota Bks',
      city: 'Bekasi',
      phone: '0895383002103',
      isMainBranch: false,
    ),
  ];
}
