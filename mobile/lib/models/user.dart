class User {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String? role;
  final String? avatarUrl;
  final String? nik;
  final String? address;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    this.role,
    this.avatarUrl,
    this.nik,
    this.address,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? json['no_hp']?.toString() ?? '-',
      role: json['role']?.toString() ?? 'customer',
      avatarUrl: json['profile_photo_url']?.toString() ?? json['avatar']?.toString(),
      nik: json['nik']?.toString(),
      address: json['alamat']?.toString() ?? json['address']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'profile_photo_url': avatarUrl,
      'nik': nik,
      'alamat': address,
    };
  }
}
