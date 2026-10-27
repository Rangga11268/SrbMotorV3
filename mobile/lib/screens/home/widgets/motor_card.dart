import 'package:flutter/material.dart';
import '../../../models/motor.dart';
import '../../../widgets/motor_image_view.dart';

class MotorCard extends StatelessWidget {
  final Motor motor;
  final bool isWishlisted;
  final VoidCallback onWishlistToggle;
  final VoidCallback onTap;
  final String Function(double price)? formatPrice;

  const MotorCard({
    super.key,
    required this.motor,
    required this.isWishlisted,
    required this.onWishlistToggle,
    required this.onTap,
    this.formatPrice,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isAvailable = motor.isAvailable == true;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0), width: 0.8),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Motor Image Container
                Stack(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        width: 104,
                        height: 96,
                        color: const Color(0xFFF8FAFC),
                        child: isAvailable
                            ? MotorImageView(
                                imageUrl: motor.displayImageUrl,
                                assetPath: motor.imagePath,
                                fit: BoxFit.contain,
                                width: 104,
                                height: 96,
                              )
                            : Opacity(
                                opacity: 0.45,
                                child: MotorImageView(
                                  imageUrl: motor.displayImageUrl,
                                  assetPath: motor.imagePath,
                                  fit: BoxFit.contain,
                                  width: 104,
                                  height: 96,
                                ),
                              ),
                      ),
                    ),
                    if (!isAvailable)
                      Positioned(
                        top: 4,
                        left: 4,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEF4444),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'HABIS',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 14),

                // Motor Info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${motor.brand.toUpperCase()} • ${motor.year}',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.grey[500],
                                    letterSpacing: 0.5,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  motor.name,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: theme.textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.w800,
                                    fontSize: 15,
                                    color: const Color(0xFF0F172A),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          InkResponse(
                            onTap: onWishlistToggle,
                            radius: 18,
                            child: Icon(
                              isWishlisted ? Icons.favorite : Icons.favorite_border,
                              size: 20,
                              color: isWishlisted ? const Color(0xFFEF4444) : Colors.grey[400],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),

                      // Price & DP Tag
                      Row(
                        children: [
                          Text(
                            formatPrice != null ? formatPrice!(motor.price) : motor.formattedPrice,
                            style: const TextStyle(
                              color: Color(0xFF1C69D4),
                              fontWeight: FontWeight.w800,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),

                      // Specs Chips
                      Row(
                        children: [
                          _specChip('${motor.engineCC} cc'),
                          const SizedBox(width: 6),
                          _specChip(motor.type),
                          if (motor.stock > 0 && isAvailable) ...[
                            const SizedBox(width: 6),
                            _specChip('Stok ${motor.stock}', isHighlight: true),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _specChip(String text, {bool isHighlight = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: isHighlight ? const Color(0xFFECFDF5) : const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(
          color: isHighlight ? const Color(0xFFA7F3D0) : const Color(0xFFE2E8F0),
          width: 0.5,
        ),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: isHighlight ? const Color(0xFF059669) : const Color(0xFF475569),
        ),
      ),
    );
  }
}
