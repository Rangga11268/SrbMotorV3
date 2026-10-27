import 'package:flutter/material.dart';

class MotorImageView extends StatelessWidget {
  final String? imageUrl;
  final String? assetPath;
  final BoxFit fit;
  final double? width;
  final double? height;

  const MotorImageView({
    super.key,
    this.imageUrl,
    this.assetPath,
    this.fit = BoxFit.contain,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    final validNetUrl = imageUrl != null && imageUrl!.startsWith('http');
    final validAsset = assetPath != null && assetPath!.isNotEmpty;

    if (validNetUrl) {
      return Image.network(
        imageUrl!,
        width: width,
        height: height,
        fit: fit,
        loadingBuilder: (context, child, loadingProgress) {
          if (loadingProgress == null) return child;
          return Center(
            child: SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Theme.of(context).colorScheme.primary,
                value: loadingProgress.expectedTotalBytes != null
                    ? loadingProgress.cumulativeBytesLoaded /
                        loadingProgress.expectedTotalBytes!
                    : null,
              ),
            ),
          );
        },
        errorBuilder: (context, error, stackTrace) {
          if (validAsset) {
            return Image.asset(
              assetPath!,
              width: width,
              height: height,
              fit: fit,
              errorBuilder: (ctx, err, stack) => _fallbackPlaceholder(),
            );
          }
          return _fallbackPlaceholder();
        },
      );
    }

    if (validAsset) {
      return Image.asset(
        assetPath!,
        width: width,
        height: height,
        fit: fit,
        errorBuilder: (ctx, err, stack) => _fallbackPlaceholder(),
      );
    }

    return _fallbackPlaceholder();
  }

  Widget _fallbackPlaceholder() {
    return Container(
      width: width,
      height: height,
      color: const Color(0xFFF1F5F9),
      child: const Center(
        child: Icon(Icons.two_wheeler, size: 40, color: Color(0xFF94A3B8)),
      ),
    );
  }
}
