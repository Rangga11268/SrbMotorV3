import 'package:flutter/material.dart';
import '../../../models/motor.dart';
import '../../../widgets/motor_image_view.dart';

class FeaturedMotorCard extends StatelessWidget {
  final Motor motor;
  final bool isWishlisted;
  final VoidCallback onWishlistToggle;
  final VoidCallback onTap;
  final String Function(double price)? formatPrice;

  const FeaturedMotorCard({
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
      width: 210,
      margin: const EdgeInsets.only(right: 14),
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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Image Stack
              Stack(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                    child: Container(
                      height: 135,
                      width: double.infinity,
                      color: const Color(0xFFF8FAFC),
                      padding: const EdgeInsets.all(12),
                      child: isAvailable
                          ? MotorImageView(
                              imageUrl: motor.displayImageUrl,
                              assetPath: motor.imagePath,
                              fit: BoxFit.contain,
                              width: 210,
                              height: 135,
                            )
                          : Opacity(
                              opacity: 0.45,
                              child: MotorImageView(
                                imageUrl: motor.displayImageUrl,
                                assetPath: motor.imagePath,
                                fit: BoxFit.contain,
                                width: 210,
                                height: 135,
                              ),
                            ),
                    ),
                  ),

                  // Brand Tag
                  Positioned(
                    top: 10,
                    left: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: const Color(0xFFE2E8F0), width: 0.8),
                      ),
                      child: Text(
                        motor.brand.toUpperCase(),
                        style: const TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ),

                  // Favorite Button
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Material(
                      color: Colors.white.withValues(alpha: 0.9),
                      shape: const CircleBorder(),
                      child: InkWell(
                        customBorder: const CircleBorder(),
                        onTap: onWishlistToggle,
                        child: Padding(
                          padding: const EdgeInsets.all(6),
                          child: Icon(
                            isWishlisted ? Icons.favorite : Icons.favorite_border,
                            size: 16,
                            color: isWishlisted ? const Color(0xFFEF4444) : Colors.grey[400],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              // Bottom Details
              Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      motor.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                        fontSize: 14,
                        color: const Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${motor.type} • ${motor.year}',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey[500],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
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
              ),
            ],
          ),
        ),
      ),
    );
  }
}
