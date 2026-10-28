import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../app_state.dart';
import '../../widgets/app_button.dart';

class OnboardingItem {
  final String stepBadge;
  final String title;
  final String description;
  final String imagePath;
  final IconData icon;

  const OnboardingItem({
    required this.stepBadge,
    required this.title,
    required this.description,
    required this.imagePath,
    required this.icon,
  });
}

class OnboardingScreen extends StatefulWidget {
  final AppState appState;

  const OnboardingScreen({super.key, required this.appState});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<OnboardingItem> _items = const [
    OnboardingItem(
      stepBadge: 'DEALER RESMI & TERPERCAYA',
      title: 'Pilihan Unit Motor Terlengkap & Bergaransi',
      description:
          'Jelajahi jajaran motor matic, sport, dan bebek terbaru dari Yamaha, Honda, dan brand terkemuka dengan kondisi 100% prima dan garansi resmi pabrikan.',
      imagePath: 'assets/images/onboarding/onboarding_1.jpg',
      icon: Icons.two_wheeler_rounded,
    ),
    OnboardingItem(
      stepBadge: 'SIMULASI KREDIT TRANSPARAN',
      title: 'Pengajuan Kredit Cepat, DP Ringan & Bunga Rendah',
      description:
          'Hitung estimasi cicilan impian Anda secara akurat. Dapatkan fasilitas uang muka ringan, tenor fleksibel hingga 36 bulan, dan tim surveyor yang siap melayani.',
      imagePath: 'assets/images/onboarding/onboarding_2.jpg',
      icon: Icons.assignment_turned_in_rounded,
    ),
    OnboardingItem(
      stepBadge: 'LAYANAN TOWING & PICKUP',
      title: 'Diantar Langsung ke Rumah atau Ambil di Dealer',
      description:
          'Nikmati kemudahan pengiriman aman dengan armada towing resmi langsung ke depan pintu rumah Anda, atau pilih pengambilan mandiri di 6 cabang SRB Motor terdekat.',
      imagePath: 'assets/images/onboarding/onboarding_3.jpg',
      icon: Icons.local_shipping_rounded,
    ),
  ];

  Future<void> _completeOnboarding() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('has_seen_onboarding', true);
    } catch (_) {}

    if (!mounted) return;

    final targetRoute = widget.appState.isAuthenticated ? '/home' : '/login';
    Navigator.of(context).pushReplacementNamed(targetRoute);
  }

  void _onNext() {
    if (_currentPage < _items.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 320),
        curve: Curves.easeInOut,
      );
    } else {
      _completeOnboarding();
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isLastPage = _currentPage == _items.length - 1;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            Image.asset(
              'assets/images/logos/logo_srb.webp',
              height: 28,
              errorBuilder: (context, error, stackTrace) => const Icon(
                Icons.two_wheeler_rounded,
                color: Color(0xFF1D4ED8),
                size: 24,
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              'SRB MOTOR',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
                letterSpacing: 0.8,
              ),
            ),
          ],
        ),
        actions: [
          if (!isLastPage)
            TextButton(
              onPressed: _completeOnboarding,
              child: const Text(
                'Lewati',
                style: TextStyle(
                  color: Color(0xFF64748B),
                  fontWeight: FontWeight.w700,
                  fontSize: 13,
                ),
              ),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        top: false,
        child: Column(
          children: [
            // PageView Content
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                physics: const BouncingScrollPhysics(),
                onPageChanged: (idx) => setState(() => _currentPage = idx),
                itemCount: _items.length,
                itemBuilder: (context, index) {
                  final item = _items[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const SizedBox(height: 12),
                        // Image Card
                        Expanded(
                          flex: 5,
                          child: Container(
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF0F172A).withValues(alpha: 0.08),
                                  blurRadius: 18,
                                  offset: const Offset(0, 8),
                                ),
                              ],
                            ),
                            clipBehavior: Clip.antiAlias,
                            child: Image.asset(
                              item.imagePath,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  color: const Color(0xFFF8FAFC),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(item.icon, size: 64, color: const Color(0xFF1D4ED8)),
                                      const SizedBox(height: 12),
                                      Text(
                                        item.stepBadge,
                                        style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: Color(0xFF64748B),
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Text content area
                        Expanded(
                          flex: 4,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              // Step Badge
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEFF6FF),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: const Color(0xFFBFDBFE)),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(item.icon, size: 13, color: const Color(0xFF1D4ED8)),
                                    const SizedBox(width: 5),
                                    Text(
                                      item.stepBadge,
                                      style: const TextStyle(
                                        fontSize: 10.5,
                                        fontWeight: FontWeight.w800,
                                        color: Color(0xFF1D4ED8),
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 12),

                              // Headline
                              Text(
                                item.title,
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF0F172A),
                                  height: 1.3,
                                ),
                              ),
                              const SizedBox(height: 10),

                              // Description
                              Text(
                                item.description,
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  fontSize: 13.5,
                                  color: Color(0xFF64748B),
                                  height: 1.5,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Indicator Dots & Bottom Action Buttons
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 20),
              child: Column(
                children: [
                  // Smooth Dot Indicators
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(_items.length, (index) {
                      final isActive = index == _currentPage;
                      return AnimatedContainer(
                        duration: const Duration(milliseconds: 240),
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        height: 7,
                        width: isActive ? 24 : 7,
                        decoration: BoxDecoration(
                          color: isActive ? const Color(0xFF1D4ED8) : const Color(0xFFCBD5E1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 20),

                  // Glossy Action Button
                  AppButton.primary(
                    text: isLastPage ? 'Mulai Sekarang' : 'Lanjutkan',
                    isFullWidth: true,
                    size: AppButtonSize.large,
                    icon: isLastPage ? Icons.check_circle_rounded : Icons.arrow_forward_rounded,
                    iconAfter: true,
                    onPressed: _onNext,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
