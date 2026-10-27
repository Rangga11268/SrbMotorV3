import 'package:intl/intl.dart';
import '../services/api_constants.dart';

class Motor {
  final int id;
  final String name;
  final String brand;
  final String type;
  final double price;
  final String imagePath;
  final String? serverImageUrl;
  final int year;
  final String transmission;
  final int engineCC;
  final int weight;
  final List<String> colors;
  final String description;
  final bool isAvailable;
  final int stock;
  final double minDp;

  Motor({
    required this.id,
    required this.name,
    required this.brand,
    required this.type,
    required this.price,
    required this.imagePath,
    this.serverImageUrl,
    required this.year,
    this.transmission = 'Otomatis',
    this.engineCC = 150,
    this.weight = 130,
    required this.colors,
    required this.description,
    this.isAvailable = true,
    this.stock = 1,
    this.minDp = 0,
  });

  factory Motor.fromJson(Map<String, dynamic> json) {
    // Parse colors
    List<String> parsedColors = [];
    if (json['colors'] is List) {
      parsedColors = (json['colors'] as List).map((e) => e.toString()).toList();
    } else if (json['colors'] is String) {
      final clean = (json['colors'] as String)
          .replaceAll('[', '')
          .replaceAll(']', '')
          .replaceAll('"', '')
          .replaceAll("'", '')
          .replaceAll('\\', '');
      parsedColors = clean.split(',').map((e) => e.trim()).where((e) => e.isNotEmpty).toList();
    }
    if (parsedColors.isEmpty) {
      parsedColors = ['Hitam', 'Putih', 'Merah'];
    }

    final rawPrice = json['price'];
    final double parsedPrice = rawPrice is num
        ? rawPrice.toDouble()
        : double.tryParse(rawPrice?.toString() ?? '0') ?? 0.0;

    final rawMinDp = json['min_dp_amount'] ?? json['min_dp'];
    final double parsedMinDp = rawMinDp is num
        ? rawMinDp.toDouble()
        : double.tryParse(rawMinDp?.toString() ?? '0') ?? 0.0;

    final rawYear = json['year'];
    final int parsedYear = rawYear is int
        ? rawYear
        : int.tryParse(rawYear?.toString() ?? '2024') ?? 2024;

    final rawStock = json['stock'];
    final int parsedStock = rawStock is int
        ? rawStock
        : int.tryParse(rawStock?.toString() ?? '1') ?? 1;

    final bool tersedia = json['tersedia'] == true || json['tersedia'] == 1 || json['tersedia'] == '1';

    return Motor(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      name: json['name']?.toString() ?? 'Unit Motor',
      brand: json['brand']?.toString() ?? 'SRB',
      type: json['type']?.toString() ?? 'Matic',
      price: parsedPrice,
      imagePath: json['image_path']?.toString() ?? '',
      serverImageUrl: json['image']?.toString(),
      year: parsedYear,
      transmission: json['transmission']?.toString() ?? (json['type']?.toString().toLowerCase().contains('sport') == true ? 'Manual' : 'Otomatis'),
      engineCC: json['engine_cc'] is int ? json['engine_cc'] : (int.tryParse(json['engine_cc']?.toString() ?? '') ?? 150),
      weight: json['weight'] is int ? json['weight'] : (int.tryParse(json['weight']?.toString() ?? '') ?? 130),
      colors: parsedColors,
      description: json['details']?.toString() ?? json['description']?.toString() ?? 'Unit motor bergaransi resmi dari SRB Motor.',
      isAvailable: tersedia,
      stock: parsedStock,
      minDp: parsedMinDp,
    );
  }

  // Resolved URL for Network Image
  String get displayImageUrl {
    if (serverImageUrl != null && serverImageUrl!.isNotEmpty) {
      return ApiConstants.resolveImageUrl(serverImageUrl);
    }
    if (imagePath.isNotEmpty) {
      return ApiConstants.resolveImageUrl(imagePath);
    }
    return '';
  }

  // Currency formatted price (e.g. Rp 35.500.000)
  String get formattedPrice {
    return NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0).format(price);
  }

  // Compact price string (e.g. Rp 35,5 jt)
  String get compactPrice {
    if (price >= 1000000) {
      return 'Rp ${(price / 1000000).toStringAsFixed(1)} jt';
    }
    return formattedPrice;
  }
}

// Fallback static data if offline
final List<Motor> motorList = [
  Motor(
    id: 1,
    name: 'Yamaha NMAX Turbo 2024',
    brand: 'Yamaha',
    type: 'Matic',
    price: 35500000,
    imagePath: 'assets/img/yamaha/NMax_Turbo.webp',
    year: 2024,
    transmission: 'Otomatis',
    engineCC: 155,
    weight: 135,
    colors: ['Hitam', 'Putih', 'Merah'],
    description: 'Mesin Blue Core 155cc, Y-Connect Navigation, Electric Power Socket dengan kenyamanan maksimal.',
  ),
  Motor(
    id: 2,
    name: 'Yamaha Aerox 155 Cyber City',
    brand: 'Yamaha',
    type: 'Sport Matic',
    price: 31200000,
    imagePath: 'assets/img/yamaha/aerox_155.webp',
    year: 2024,
    transmission: 'Otomatis',
    engineCC: 155,
    weight: 125,
    colors: ['Cyber Matte', 'Hitam'],
    description: 'Desain sporty yang agresif dengan performa mesin yang tangguh. Cocok untuk jiwa muda.',
  ),
  Motor(
    id: 3,
    name: 'Yamaha Fazzio Lux Edition',
    brand: 'Yamaha',
    type: 'Classy',
    price: 23500000,
    imagePath: 'assets/img/yamaha/Fazzio.webp',
    year: 2024,
    transmission: 'Otomatis',
    engineCC: 125,
    weight: 95,
    colors: ['Prestige Silver', 'White'],
    description: 'Motor hybrid pertama di kelasnya. Hemat bahan bakar dan tampil elegan.',
  ),
  Motor(
    id: 4,
    name: 'Honda PCX 160 ABS',
    brand: 'Honda',
    type: 'Matic Premium',
    price: 36000000,
    imagePath: 'assets/img/honda/pcx_160.webp',
    year: 2024,
    transmission: 'Otomatis',
    engineCC: 160,
    weight: 132,
    colors: ['White', 'Matte Black', 'Red'],
    description: 'Desain mewah dengan performa mesin eSP+ 160cc 4-katup yang bertenaga.',
  ),
  Motor(
    id: 5,
    name: 'Honda Vario 160',
    brand: 'Honda',
    type: 'Sport Matic',
    price: 27350000,
    imagePath: 'assets/img/honda/vario_160.webp',
    year: 2024,
    transmission: 'Otomatis',
    engineCC: 160,
    weight: 117,
    colors: ['Grande Matte Black', 'Red'],
    description: 'Tampil lebih besar dan tangguh dengan mesin 160cc untuk aktivitas harian.',
  ),
  Motor(
    id: 6,
    name: 'Honda Scoopy Prestige',
    brand: 'Honda',
    type: 'Classic',
    price: 22000000,
    imagePath: 'assets/img/honda/scoopy.webp',
    year: 2024,
    transmission: 'Otomatis',
    engineCC: 110,
    weight: 94,
    colors: ['Prestige White', 'Prestige Black'],
    description: 'Fitur Smart Key System lengkap gaya retro yang abadi sepanjang masa.',
  ),
];
