---
name: security-and-hardening
description: Security-first practices, PII data protection, private document storage, payment webhook integrity, and authorization checks for SRB Motor.
---

# Security & Hardening (SRB Motor)

Use this skill when handling financial transactions, payments, user authentication, authorization, or sensitive files (KTP, KK, Slip Gaji).

## 1. PII & Sensitive File Storage
- **Critical Requirement**: Never store customer verification files (KTP, KK, Slip Gaji) in the `public` storage disk (`storage/app/public`).
- **Private Storage**: Store all uploaded identification documents in the `local` / `private` disk (`storage/app/private/documents/`).
- **Authorized Download**: Any route serving documents must verify that the requesting user owns the document or has `admin`/`owner` role.

## 2. Payment Gateway & Webhook Security (Midtrans)
- **Signature Verification**: Always calculate and match the SHA-512 signature key (`order_id + status_code + gross_amount + server_key`) before accepting a webhook notification in `PaymentCallbackController`.
- **Exact Amount Verification**: Match `(int) $notification->gross_amount === (int) $expectedAmount`.
- **Sanitized Errors**: Never output raw exception traces (`$e->getMessage()`) in webhook JSON responses.

## 3. Access Control & Authorization (IDOR Prevention)
- Check ownership on every customer resource access:
  ```php
  if (auth()->id() !== $transaction->user_id && !auth()->user()->isAdmin()) {
      abort(403, 'Unauthorized access to this transaction.');
  }
  ```
- Protect Admin routes with middleware `admin` and Owner-exclusive routes (user role modification, financial reports) with middleware `owner`.
- Apply strict rate limiting (`throttle:15,1` or `throttle:5,1`) on sensitive routes (auth, login, checkout, payment).
