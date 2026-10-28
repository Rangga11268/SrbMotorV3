import 'package:flutter/material.dart';

enum AppButtonVariant {
  primary,
  secondary,
  outline,
  success,
  danger,
  ghost,
}

enum AppButtonSize {
  small,
  medium,
  large,
}

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final IconData? icon;
  final bool iconAfter;
  final bool isLoading;
  final bool isFullWidth;
  final double? width;
  final EdgeInsetsGeometry? padding;

  const AppButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.size = AppButtonSize.large,
    this.icon,
    this.iconAfter = false,
    this.isLoading = false,
    this.isFullWidth = false,
    this.width,
    this.padding,
  });

  // Pre-configured Named Constructors for Quick Convenience
  const AppButton.primary({
    super.key,
    required this.text,
    this.onPressed,
    this.size = AppButtonSize.large,
    this.icon,
    this.iconAfter = false,
    this.isLoading = false,
    this.isFullWidth = false,
    this.width,
    this.padding,
  }) : variant = AppButtonVariant.primary;

  const AppButton.secondary({
    super.key,
    required this.text,
    this.onPressed,
    this.size = AppButtonSize.large,
    this.icon,
    this.iconAfter = false,
    this.isLoading = false,
    this.isFullWidth = false,
    this.width,
    this.padding,
  }) : variant = AppButtonVariant.secondary;

  const AppButton.outline({
    super.key,
    required this.text,
    this.onPressed,
    this.size = AppButtonSize.large,
    this.icon,
    this.iconAfter = false,
    this.isLoading = false,
    this.isFullWidth = false,
    this.width,
    this.padding,
  }) : variant = AppButtonVariant.outline;

  const AppButton.success({
    super.key,
    required this.text,
    this.onPressed,
    this.size = AppButtonSize.large,
    this.icon,
    this.iconAfter = false,
    this.isLoading = false,
    this.isFullWidth = false,
    this.width,
    this.padding,
  }) : variant = AppButtonVariant.success;

  const AppButton.danger({
    super.key,
    required this.text,
    this.onPressed,
    this.size = AppButtonSize.large,
    this.icon,
    this.iconAfter = false,
    this.isLoading = false,
    this.isFullWidth = false,
    this.width,
    this.padding,
  }) : variant = AppButtonVariant.danger;

  @override
  Widget build(BuildContext context) {
    final bool isEnabled = onPressed != null && !isLoading;

    // Sizing specs
    final double height = switch (size) {
      AppButtonSize.small => 38.0,
      AppButtonSize.medium => 44.0,
      AppButtonSize.large => 52.0,
    };

    final double fontSize = switch (size) {
      AppButtonSize.small => 12.5,
      AppButtonSize.medium => 13.5,
      AppButtonSize.large => 14.5,
    };

    final double iconSize = switch (size) {
      AppButtonSize.small => 15.0,
      AppButtonSize.medium => 17.0,
      AppButtonSize.large => 19.0,
    };

    final double borderRadius = switch (size) {
      AppButtonSize.small => 10.0,
      AppButtonSize.medium => 12.0,
      AppButtonSize.large => 14.0,
    };

    final EdgeInsetsGeometry defaultPadding = switch (size) {
      AppButtonSize.small => const EdgeInsets.symmetric(horizontal: 14),
      AppButtonSize.medium => const EdgeInsets.symmetric(horizontal: 18),
      AppButtonSize.large => const EdgeInsets.symmetric(horizontal: 22),
    };

    // Colors, Gradients & Shadows based on variant & state
    final LinearGradient? gradient = !isEnabled
        ? null
        : switch (variant) {
            AppButtonVariant.primary => const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF2563EB), Color(0xFF1D4ED8), Color(0xFF1E40AF)],
                stops: [0.0, 0.6, 1.0],
              ),
            AppButtonVariant.secondary => const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF334155), Color(0xFF1E293B), Color(0xFF0F172A)],
                stops: [0.0, 0.6, 1.0],
              ),
            AppButtonVariant.success => const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF22C55E), Color(0xFF16A34A), Color(0xFF15803D)],
                stops: [0.0, 0.6, 1.0],
              ),
            AppButtonVariant.danger => const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFFF87171), Color(0xFFEF4444), Color(0xFFDC2626)],
                stops: [0.0, 0.6, 1.0],
              ),
            AppButtonVariant.outline => null,
            AppButtonVariant.ghost => null,
          };

    final Color solidColor = !isEnabled
        ? const Color(0xFFE2E8F0)
        : switch (variant) {
            AppButtonVariant.outline => Colors.white,
            AppButtonVariant.ghost => Colors.transparent,
            _ => const Color(0xFF1D4ED8),
          };

    final Border? border = !isEnabled
        ? Border.all(color: const Color(0xFFCBD5E1), width: 1.2)
        : switch (variant) {
            AppButtonVariant.outline => Border.all(color: const Color(0xFFCBD5E1), width: 1.5),
            AppButtonVariant.ghost => null,
            _ => Border.all(color: Colors.white.withValues(alpha: 0.28), width: 1.2),
          };

    final List<BoxShadow>? boxShadow = !isEnabled
        ? null
        : switch (variant) {
            AppButtonVariant.primary => [
                BoxShadow(
                  color: const Color(0xFF1D4ED8).withValues(alpha: 0.32),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            AppButtonVariant.secondary => [
                BoxShadow(
                  color: const Color(0xFF0F172A).withValues(alpha: 0.25),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            AppButtonVariant.success => [
                BoxShadow(
                  color: const Color(0xFF16A34A).withValues(alpha: 0.32),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            AppButtonVariant.danger => [
                BoxShadow(
                  color: const Color(0xFFEF4444).withValues(alpha: 0.32),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            AppButtonVariant.outline => [
                BoxShadow(
                  color: const Color(0xFF0F172A).withValues(alpha: 0.04),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            AppButtonVariant.ghost => null,
          };

    final Color textColor = !isEnabled
        ? const Color(0xFF94A3B8)
        : switch (variant) {
            AppButtonVariant.outline => const Color(0xFF334155),
            AppButtonVariant.ghost => const Color(0xFF1D4ED8),
            _ => Colors.white,
          };

    Widget content = Row(
      mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        if (isLoading) ...[
          SizedBox(
            width: iconSize,
            height: iconSize,
            child: CircularProgressIndicator(
              strokeWidth: 2.2,
              valueColor: AlwaysStoppedAnimation<Color>(textColor),
            ),
          ),
          const SizedBox(width: 8),
        ] else if (icon != null && !iconAfter) ...[
          Icon(icon, size: iconSize, color: textColor),
          const SizedBox(width: 8),
        ],
        Text(
          text,
          style: TextStyle(
            color: textColor,
            fontSize: fontSize,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.3,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        if (!isLoading && icon != null && iconAfter) ...[
          const SizedBox(width: 8),
          Icon(icon, size: iconSize, color: textColor),
        ],
      ],
    );

    return Container(
      width: isFullWidth ? double.infinity : width,
      height: height,
      decoration: BoxDecoration(
        color: gradient == null ? solidColor : null,
        gradient: gradient,
        borderRadius: BorderRadius.circular(borderRadius),
        border: border,
        boxShadow: boxShadow,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: isEnabled ? onPressed : null,
          borderRadius: BorderRadius.circular(borderRadius),
          splashColor: Colors.white.withValues(alpha: 0.18),
          highlightColor: Colors.white.withValues(alpha: 0.08),
          child: Padding(
            padding: padding ?? defaultPadding,
            child: content,
          ),
        ),
      ),
    );
  }
}
