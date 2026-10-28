import 'package:flutter/material.dart';
import 'package:srb_motor_app/app_state.dart';
import 'package:srb_motor_app/models/motor.dart';
import 'package:srb_motor_app/screens/detail/motor_compare_screen.dart';
import 'package:srb_motor_app/widgets/motor_image_view.dart';
import 'package:srb_motor_app/screens/order/order_checkout_screen.dart';

class MotorDetailScreen extends StatefulWidget {
  final Motor motor;
  final AppState appState;
  final String Function(double price)? formatPrice;

  const MotorDetailScreen({
    super.key,
    required this.motor,
    required this.appState,
    this.formatPrice,
  });

  @override
  State<MotorDetailScreen> createState() => _MotorDetailScreenState();
}

class _MotorDetailScreenState extends State<MotorDetailScreen> {
  double dpPercent = 20.0; // Default to 20% DP as in the web version
  int selectedTenor = 36; // Default to 36 months tenor as in the web version
  final List<int> tenors = const [12, 24, 36]; // Tenors: 12, 24, 36 months

  double get monthlyInstallment {
    final dpAmount = widget.motor.price * (dpPercent / 100);
    final principal = widget.motor.price - dpAmount;
    if (principal <= 0) return 0;
    const interestRate = 0.015; // 1.5% flat interest per month
    final totalInterest = principal * interestRate * selectedTenor;
    return (principal + totalInterest) / selectedTenor;
  }

  String formatFullCurrency(double amount) {
    final buffer = StringBuffer('Rp ');
    final str = amount.toInt().toString();
    int len = str.length;
    for (int i = 0; i < len; i++) {
      buffer.write(str[i]);
      if ((len - i - 1) % 3 == 0 && i != len - 1) {
        buffer.write('.');
      }
    }
    return buffer.toString();
  }

  /// Clean HTML markup from backend rich-text description into elegant formatted text
  String _cleanHtml(String html) {
    if (html.isEmpty) return 'Tidak ada deskripsi.';
    var text = html
        .replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'</?(h[1-6]|p|div)[^>]*>', caseSensitive: false), '\n\n')
        .replaceAll(RegExp(r'<li[^>]*>', caseSensitive: false), '\n• ')
        .replaceAll(RegExp(r'</li>', caseSensitive: false), '')
        .replaceAll(RegExp(r'</?(ul|ol)[^>]*>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'<[^>]*>'), '')
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&amp;', '&')
        .replaceAll('&quot;', '"')
        .replaceAll('&#39;', "'")
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>');
    return text.replaceAll(RegExp(r'\n{3,}'), '\n\n').trim();
  }

  void _showCompareSelection(BuildContext context) {
    final otherMotors = widget.appState.motors.where((m) => m.id != widget.motor.id).toList();

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Pilih Motor Pembanding',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF041627),
                ),
              ),
              const SizedBox(height: 12),
              Expanded(
                child: ListView.separated(
                  itemCount: otherMotors.length,
                  separatorBuilder: (context, index) => const Divider(),
                  itemBuilder: (context, index) {
                    final other = otherMotors[index];
                    return ListTile(
                      leading: SizedBox(
                        width: 50,
                        child: MotorImageView(
                          imageUrl: other.displayImageUrl,
                          assetPath: other.imagePath,
                          width: 50,
                          height: 40,
                          fit: BoxFit.contain,
                        ),
                      ),
                      title: Text(
                        other.name,
                        style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF041627)),
                      ),
                      subtitle: Text('${other.brand} • ${widget.formatPrice != null ? widget.formatPrice!(other.price) : other.formattedPrice}'),
                      onTap: () {
                        Navigator.pop(context); // Close bottom sheet
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => MotorCompareScreen(
                              motor1: widget.motor,
                              motor2: other,
                              formatPrice: widget.formatPrice ?? (p) => formatFullCurrency(p),
                            ),
                          ),
                        );
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showAuthRequiredSheet(BuildContext context, String actionText) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: const BoxDecoration(
                color: Color(0xFFEFF6FF),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.lock_outline_rounded, color: Color(0xFF1C69D4), size: 32),
            ),
            const SizedBox(height: 16),
            const Text(
              'Sesi Diperlukan',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 8),
            Text(
              'Silakan masuk ke akun SRB Motor Anda terlebih dahulu untuk $actionText.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.4),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  Navigator.of(context).pushNamed('/login');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1C69D4),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 0,
                ),
                child: const Text('Masuk ke Akun', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
              ),
            ),
            const SizedBox(height: 10),
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Batal', style: TextStyle(color: Color(0xFF64748B))),
            ),
          ],
        ),
      ),
    );
  }

  void _openCheckout(BuildContext context, {required bool isCredit}) async {
    if (!widget.appState.isAuthenticated) {
      _showAuthRequiredSheet(
        context,
        isCredit ? 'mengajukan pembelian kredit' : 'melakukan pemesanan tunai',
      );
      return;
    }

    final result = await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (context) => OrderCheckoutScreen(
          motor: widget.motor,
          appState: widget.appState,
          isCredit: isCredit,
        ),
      ),
    );

    if (result == true && mounted) {
      widget.appState.fetchMotors();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isWishlisted = widget.appState.isInWishlist(widget.motor.id);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.motor.name),
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Image Presentation
          Container(
            height: 250,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withValues(alpha: 0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(18),
              child: Stack(
                children: [
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: MotorImageView(
                        imageUrl: widget.motor.displayImageUrl,
                        assetPath: widget.motor.imagePath,
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                  Positioned(
                    top: 14,
                    right: 14,
                    child: Material(
                      color: Colors.white,
                      shape: const CircleBorder(),
                      child: IconButton(
                        onPressed: () async {
                          await widget.appState.toggleWishlist(widget.motor.id);
                          setState(() {});
                        },
                        icon: Icon(
                          isWishlisted ? Icons.favorite : Icons.favorite_border,
                          color: isWishlisted ? Colors.red : Colors.grey,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Main Info Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.motor.name,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${widget.motor.brand} • ${widget.motor.type}',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.grey[600],
                        ),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        widget.formatPrice != null
                            ? widget.formatPrice!(widget.motor.price)
                            : widget.motor.formattedPrice,
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              color: const Color(0xFF1C69D4),
                              fontWeight: FontWeight.w800,
                            ),
                      ),
                      OutlinedButton.icon(
                        onPressed: () => _showCompareSelection(context),
                        icon: const Icon(Icons.compare_arrows, size: 18),
                        label: const Text(
                          'BANDINGKAN',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF1C69D4),
                          side: const BorderSide(color: Color(0xFF1C69D4)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  _detailTitle(context, 'Deskripsi'),
                  const SizedBox(height: 8),
                  Text(
                    _cleanHtml(widget.motor.description),
                    style: const TextStyle(fontSize: 13, height: 1.5, color: Color(0xFF334155)),
                  ),
                  const SizedBox(height: 18),
                  _detailTitle(context, 'Spesifikasi'),
                  const SizedBox(height: 12),
                  _specRow('Tahun', widget.motor.year.toString()),
                  _specRow('Transmisi', widget.motor.transmission),
                  _specRow('Mesin', '${widget.motor.engineCC} cc'),
                  _specRow('Berat', '${widget.motor.weight} kg'),
                  const SizedBox(height: 18),
                  _detailTitle(context, 'Warna Pilihan'),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: widget.motor.colors
                        .map(
                          (color) => Chip(
                            label: Text(color),
                            backgroundColor: const Color(0xFFEFF6FF),
                          ),
                        )
                        .toList(),
                  ),
                  const SizedBox(height: 24),

                  // In-App Ordering Actions (Synchronized with Web)
                  if (widget.motor.isAvailable) ...[
                    // Beli Tunai Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton.icon(
                        onPressed: () => _openCheckout(context, isCredit: false),
                        icon: const Icon(Icons.shopping_bag_outlined, color: Colors.white, size: 20),
                        label: const Text(
                          'PEMBELIAN TUNAI (CASH)',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                            fontSize: 13,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1C69D4),
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),

                    // Pengajuan Kredit Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: OutlinedButton.icon(
                        onPressed: () => _openCheckout(context, isCredit: true),
                        icon: const Icon(Icons.credit_card_outlined, color: Color(0xFF0F172A), size: 20),
                        label: const Text(
                          'PENGAJUAN KREDIT',
                          style: TextStyle(
                            color: Color(0xFF0F172A),
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                            fontSize: 13,
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFFCBD5E1), width: 1.5),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                  ] else ...[
                    // Sold out banner
                    Container(
                      width: double.infinity,
                      height: 50,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFCBD5E1)),
                      ),
                      alignment: Alignment.center,
                      child: const Text(
                        'UNIT TERJUAL / STOK KOSONG',
                        style: TextStyle(
                          color: Color(0xFF94A3B8),
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.8,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 10),

                  // Hubungi Dealer via WhatsApp
                  SizedBox(
                    width: double.infinity,
                    height: 46,
                    child: TextButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Menghubungi dealer untuk unit ${widget.motor.name}...'),
                            backgroundColor: const Color(0xFF0F172A),
                          ),
                        );
                      },
                      icon: const Icon(Icons.chat_bubble_outline_rounded, color: Color(0xFF16A34A), size: 18),
                      label: const Text(
                        'TANYA VIA WHATSAPP',
                        style: TextStyle(
                          color: Color(0xFF16A34A),
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.5,
                          fontSize: 12.5,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Credit Simulation Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _detailTitle(context, 'Simulasi Kredit'),
                  const SizedBox(height: 6),
                  Text(
                    'Estimasi pembiayaan dengan bunga flat 1.5% per bulan.',
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  ),
                  const SizedBox(height: 20),
                  // DP Percentage Slider Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Uang Muka (DP): ${dpPercent.toInt()}%',
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                      ),
                      Text(
                        formatFullCurrency(widget.motor.price * (dpPercent / 100)),
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1C69D4),
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                  Slider(
                    value: dpPercent,
                    min: 10.0,
                    max: 80.0,
                    divisions: 14,
                    label: '${dpPercent.toInt()}%',
                    activeColor: const Color(0xFF1C69D4),
                    inactiveColor: const Color(0xFFEFF6FF),
                    onChanged: (value) {
                      setState(() {
                        dpPercent = value;
                      });
                    },
                  ),
                  const SizedBox(height: 12),
                  // Tenor Selection
                  const Text(
                    'Pilih Tenor (Bulan)',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: tenors.map((tenor) {
                      final active = selectedTenor == tenor;
                      return ChoiceChip(
                        label: Text('$tenor Bulan'),
                        selected: active,
                        checkmarkColor: Colors.white, // High contrast white checkmark
                        onSelected: (selected) {
                          if (selected) {
                            setState(() {
                              selectedTenor = tenor;
                            });
                          }
                        },
                        selectedColor: const Color(0xFF1C69D4),
                        backgroundColor: const Color(0xFFF1F5F9),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                          side: BorderSide(
                            color: active ? const Color(0xFF1C69D4) : const Color(0xFFE2E8F0),
                          ),
                        ),
                        labelStyle: TextStyle(
                          color: active ? Colors.white : const Color(0xFF041627),
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),
                  // Monthly Installment Result Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEFF6FF),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'ESTIMASI ANGSURAN',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1C69D4),
                            letterSpacing: 1.0,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          formatFullCurrency(monthlyInstallment),
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF041627),
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          '/ bulan',
                          style: TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                  if (widget.motor.isAvailable) ...[
                    const SizedBox(height: 14),
                    SizedBox(
                      width: double.infinity,
                      height: 46,
                      child: ElevatedButton.icon(
                        onPressed: () => _openCheckout(context, isCredit: true),
                        icon: const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
                        label: Text(
                          'AJUKAN DENGAN TENOR $selectedTenor BULAN',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                            fontSize: 12,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1C69D4),
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _detailTitle(BuildContext context, String text) {
    return Text(
      text,
      style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w800,
          ),
    );
  }

  Widget _specRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey[700])),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}
