import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../core/constants.dart';

enum PaymentResult { success, pending, error, cancelled }

class MidtransPaymentScreen extends StatefulWidget {
  final String snapUrl;
  final String orderReference;

  const MidtransPaymentScreen({
    super.key,
    required this.snapUrl,
    required this.orderReference,
  });

  @override
  State<MidtransPaymentScreen> createState() => _MidtransPaymentScreenState();
}

class _MidtransPaymentScreenState extends State<MidtransPaymentScreen> {
  late final WebViewController _controller;
  int _loadingProgress = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initWebView();
  }

  void _initWebView() {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.white)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            if (mounted) {
              setState(() {
                _loadingProgress = progress;
                _isLoading = progress < 100;
              });
            }
          },
          onPageStarted: (String url) {
            if (mounted) {
              setState(() => _isLoading = true);
            }
            _checkCallbackUrl(url);
          },
          onPageFinished: (String url) {
            if (mounted) {
              setState(() => _isLoading = false);
            }
            _checkCallbackUrl(url);
          },
          onWebResourceError: (WebResourceError error) {
            debugPrint('Midtrans WebView Error: ${error.description}');
          },
          onNavigationRequest: (NavigationRequest request) {
            final url = request.url;

            // Intercept custom scheme srbmotor://
            if (url.startsWith('srbmotor://') || url.contains('srbmotor://')) {
              _handleSrbMotorScheme(url);
              return NavigationDecision.prevent;
            }

            // External intent / deep-links for e-wallets
            if (url.startsWith('gojek://') ||
                url.startsWith('shopeeid://') ||
                url.startsWith('intent://') ||
                url.startsWith('market://') ||
                url.startsWith('tel:') ||
                url.startsWith('whatsapp:')) {
              return NavigationDecision.prevent;
            }

            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(widget.snapUrl));
  }

  void _checkCallbackUrl(String url) {
    if (url.contains('payment-success') || url.contains('finish')) {
      _returnResult(PaymentResult.success);
    } else if (url.contains('payment-pending') || url.contains('pending')) {
      _returnResult(PaymentResult.pending);
    } else if (url.contains('payment-error') || url.contains('error')) {
      _returnResult(PaymentResult.error);
    }
  }

  void _handleSrbMotorScheme(String url) {
    if (url.contains('payment-success')) {
      _returnResult(PaymentResult.success);
    } else if (url.contains('payment-pending')) {
      _returnResult(PaymentResult.pending);
    } else if (url.contains('payment-error')) {
      _returnResult(PaymentResult.error);
    } else {
      _returnResult(PaymentResult.success);
    }
  }

  void _returnResult(PaymentResult result) {
    if (mounted) {
      Navigator.of(context).pop(result);
    }
  }

  Future<bool> _onWillPop() async {
    final shouldLeave = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.help_outline, color: AppColors.primary),
            SizedBox(width: 8),
            Text('Tutup Pembayaran?'),
          ],
        ),
        content: const Text(
          'Transaksi Anda telah tersimpan. Anda tetap dapat melanjutkan pembayaran melalui menu Pesanan.',
          style: TextStyle(fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Tetap di Sini', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Ya, Tutup'),
          ),
        ],
      ),
    );

    return shouldLeave ?? false;
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        final shouldPop = await _onWillPop();
        if (shouldPop && context.mounted) {
          Navigator.of(context).pop(PaymentResult.cancelled);
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Pembayaran Online',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              Text(
                'Ref: ${widget.orderReference}',
                style: const TextStyle(fontSize: 12, color: Colors.white70),
              ),
            ],
          ),
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          leading: IconButton(
            icon: const Icon(Icons.close),
            onPressed: () async {
              final shouldPop = await _onWillPop();
              if (shouldPop && context.mounted) {
                Navigator.of(context).pop(PaymentResult.cancelled);
              }
            },
          ),
          bottom: _isLoading
              ? PreferredSize(
                  preferredSize: const Size.fromHeight(3.0),
                  child: LinearProgressIndicator(
                    value: _loadingProgress / 100.0,
                    backgroundColor: Colors.white24,
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.amber),
                  ),
                )
              : null,
        ),
        body: WebViewWidget(controller: _controller),
      ),
    );
  }
}
