import 'dart:async';
import 'package:flutter/material.dart';
import '../../app_state.dart';
import '../../models/motor.dart';
import '../../widgets/glass_nav_bar.dart';
import '../catalog/catalog_screen.dart';
import '../orders/orders_screen.dart';
import '../profile/profile_screen.dart';
import '../detail/motor_detail_screen.dart';
import 'widgets/featured_motor_card.dart';
import 'widgets/motor_card.dart';

class HomeScreen extends StatefulWidget {
  final AppState appState;

  const HomeScreen({super.key, required this.appState});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedTab = 0;

  void _openDetail(Motor motor) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => MotorDetailScreen(
          motor: motor,
          appState: widget.appState,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      extendBody: true,
      bottomNavigationBar: GlassNavBar(
        selectedIndex: _selectedTab,
        onDestinationSelected: (index) {
          setState(() {
            _selectedTab = index;
          });
        },
      ),
      body: IndexedStack(
        index: _selectedTab,
        children: [
          _HomeDashboard(
            appState: widget.appState,
            onTabChange: (index) => setState(() => _selectedTab = index),
            onMotorTap: _openDetail,
          ),
          CatalogScreen(
            appState: widget.appState,
            onMotorTap: _openDetail,
          ),
          OrdersScreen(
            appState: widget.appState,
            onExploreCatalog: () => setState(() => _selectedTab = 1),
          ),
          ProfileScreen(
            appState: widget.appState,
            onTabChange: (index) => setState(() => _selectedTab = index),
          ),
        ],
      ),
    );
  }
}

class _HomeDashboard extends StatefulWidget {
  final AppState appState;
  final ValueChanged<int> onTabChange;
  final Function(Motor) onMotorTap;

  const _HomeDashboard({
    required this.appState,
    required this.onTabChange,
    required this.onMotorTap,
  });

  @override
  State<_HomeDashboard> createState() => _HomeDashboardState();
}

class _HomeDashboardState extends State<_HomeDashboard> {
  final PageController _bannerController = PageController();
  int _currentBannerIndex = 0;
  Timer? _bannerTimer;

  final List<String> _bannerAssets = [
    'assets/images/banner/srb_motors_dealer_banner_1.png',
    'assets/images/banner/srb_motors_dealer_banner_2.png',
    'assets/images/banner/srb_motors_dealer_banner_3.png',
  ];

  @override
  void initState() {
    super.initState();
    _bannerTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_bannerController.hasClients) {
        int next = _currentBannerIndex + 1;
        if (next >= _bannerAssets.length) next = 0;
        _bannerController.animateToPage(
          next,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _bannerTimer?.cancel();
    _bannerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final motors = widget.appState.motors;
    final popular = motors.take(4).toList();
    final latest = motors.skip(1).take(5).toList();

    return SafeArea(
      bottom: false,
      child: RefreshIndicator(
        color: const Color(0xFF1C69D4),
        onRefresh: () => widget.appState.fetchMotors(),
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
          children: [
            // Top App Bar Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Image.asset(
                      'assets/images/logos/logo_srb.webp',
                      height: 34,
                      errorBuilder: (ctx, err, stack) => const Icon(Icons.two_wheeler, color: Color(0xFF1C69D4)),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'SRB MOTOR',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                        letterSpacing: 1.0,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.receipt_long_outlined, color: Color(0xFF0F172A), size: 22),
                      tooltip: 'Pesanan Saya',
                      onPressed: () => widget.onTabChange(2),
                    ),
                    IconButton(
                      icon: const Icon(Icons.notifications_none_rounded, color: Color(0xFF0F172A), size: 22),
                      tooltip: 'Notifikasi',
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Belum ada notifikasi baru.')),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 14),

            // iOS-Style Welcome Greeting Card
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(22),
                gradient: const LinearGradient(
                  colors: [Color(0xFF131D31), Color(0xFF0A0F1D)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.12),
                  width: 1,
                ),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x240A0F1D),
                    blurRadius: 20,
                    offset: Offset(0, 10),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(22),
                child: Stack(
                  children: [
                    // Subtle ambient iOS glow in background
                    Positioned(
                      top: -40,
                      right: -30,
                      child: Container(
                        width: 140,
                        height: 140,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFF007AFF).withValues(alpha: 0.15),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: -50,
                      left: -20,
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFF38BDF8).withValues(alpha: 0.08),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // iOS Overline Tag
                                Row(
                                  children: [
                                    Container(
                                      width: 6,
                                      height: 6,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFF38BDF8),
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    const Text(
                                      'SOLUSI MOTOR IMPIAN',
                                      style: TextStyle(
                                        fontSize: 10.5,
                                        fontWeight: FontWeight.w700,
                                        letterSpacing: 1.2,
                                        color: Color(0xFF94A3B8),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  widget.appState.isAuthenticated
                                      ? 'Halo, ${widget.appState.currentUser?.name}!'
                                      : 'Dealer Resmi & Terpercaya',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w700,
                                    letterSpacing: -0.4,
                                    color: Colors.white,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 12),
                                // iOS Pill Capsule Button
                                Material(
                                  color: Colors.transparent,
                                  child: InkWell(
                                    onTap: () => widget.onTabChange(1),
                                    borderRadius: BorderRadius.circular(999),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF007AFF), // iOS System Blue
                                        borderRadius: BorderRadius.circular(999),
                                        boxShadow: [
                                          BoxShadow(
                                            color: const Color(0xFF007AFF).withValues(alpha: 0.35),
                                            blurRadius: 10,
                                            offset: const Offset(0, 3),
                                          ),
                                        ],
                                      ),
                                      child: const Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Text(
                                            'Lihat Promo Unit',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 11.5,
                                              fontWeight: FontWeight.w600,
                                              letterSpacing: -0.2,
                                            ),
                                          ),
                                          SizedBox(width: 5),
                                          Icon(
                                            Icons.arrow_forward_ios_rounded,
                                            color: Colors.white,
                                            size: 10,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 14),
                          // iOS Squircle Glass Badge
                          Container(
                            width: 56,
                            height: 56,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.white.withValues(alpha: 0.16),
                                  Colors.white.withValues(alpha: 0.05),
                                ],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.22),
                                width: 1,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF007AFF).withValues(alpha: 0.2),
                                  blurRadius: 16,
                                  offset: const Offset(0, 6),
                                ),
                              ],
                            ),
                            child: const Center(
                              child: Icon(
                                Icons.verified_rounded,
                                color: Color(0xFF38BDF8),
                                size: 28,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 18),

            // Promo Banners Slider
            SizedBox(
              height: 130,
              child: PageView.builder(
                controller: _bannerController,
                onPageChanged: (idx) => setState(() => _currentBannerIndex = idx),
                itemCount: _bannerAssets.length,
                itemBuilder: (context, index) {
                  return Container(
                    margin: const EdgeInsets.only(right: 6),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(14),
                      color: const Color(0xFFE2E8F0),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(14),
                      child: Image.asset(
                        _bannerAssets[index],
                        fit: BoxFit.cover,
                        errorBuilder: (ctx, err, stack) => const Center(child: Icon(Icons.image, color: Colors.grey)),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 10),

            // Banner Dots Indicator
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_bannerAssets.length, (idx) {
                final isCurrent = idx == _currentBannerIndex;
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: isCurrent ? 18 : 6,
                  height: 5,
                  decoration: BoxDecoration(
                    color: isCurrent ? const Color(0xFF1C69D4) : const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(4),
                  ),
                );
              }),
            ),
            const SizedBox(height: 20),

            // Quick Actions Row
            Row(
              children: [
                _quickAction(Icons.two_wheeler_rounded, 'Katalog Unit', () => widget.onTabChange(1)),
                _quickAction(Icons.calculate_outlined, 'Simulasi Cicilan', () => widget.onTabChange(1)),
                _quickAction(Icons.receipt_long_rounded, 'Status Kredit', () => widget.onTabChange(2)),
                _quickAction(Icons.support_agent_rounded, 'Bantuan WA', () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Layanan WhatsApp SRB Motor: 0897-8638-973')),
                  );
                }),
              ],
            ),
            const SizedBox(height: 26),

            // Section 1: Popular Motors (Horizontal Scroll)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Unit Motor Populer',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                TextButton(
                  onPressed: () => widget.onTabChange(1),
                  child: const Text('Lihat Semua', style: TextStyle(color: Color(0xFF1C69D4), fontSize: 13, fontWeight: FontWeight.w700)),
                ),
              ],
            ),
            const SizedBox(height: 10),

            SizedBox(
              height: 236,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: popular.length,
                itemBuilder: (context, index) {
                  final motor = popular[index];
                  return FeaturedMotorCard(
                    motor: motor,
                    isWishlisted: widget.appState.isInWishlist(motor.id),
                    onWishlistToggle: () => widget.appState.toggleWishlist(motor.id),
                    onTap: () => widget.onMotorTap(motor),
                  );
                },
              ),
            ),
            const SizedBox(height: 24),

            // Section 2: Latest Motors (Vertical List)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Pilihan Motor Lainnya',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                TextButton(
                  onPressed: () => widget.onTabChange(1),
                  child: const Text('Katalog Lengkap', style: TextStyle(color: Color(0xFF1C69D4), fontSize: 13, fontWeight: FontWeight.w700)),
                ),
              ],
            ),
            const SizedBox(height: 8),

            ...latest.map((m) => MotorCard(
                  motor: m,
                  isWishlisted: widget.appState.isInWishlist(m.id),
                  onWishlistToggle: () => widget.appState.toggleWishlist(m.id),
                  onTap: () => widget.onMotorTap(m),
                )),
          ],
        ),
      ),
    );
  }

  Widget _quickAction(IconData icon, String title, VoidCallback onTap) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Column(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE2E8F0), width: 0.8),
                ),
                child: Icon(icon, color: const Color(0xFF1C69D4), size: 24),
              ),
              const SizedBox(height: 6),
              Text(
                title,
                textAlign: TextAlign.center,
                maxLines: 2,
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
