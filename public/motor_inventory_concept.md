# Concept: Motor Inventory & Dynamic Colors

This document outlines the proposed implementation for dynamic motor colors and inventory management (Frame & Engine numbers).

## 1. Dynamic Motor Colors
Each motor model has specific color options produced by the manufacturer.

### Technical Plan:
- **Database**: Add `available_colors` (JSON or comma-separated string) to the `motors` table.
- **Admin Management**: 
  - Add an input field in the "Create/Edit Motor" form to manage these colors.
  - Concept: A simple tag-style input or comma-separated text (e.g., `Matte Black, Prestige Silver`).
- **User Order Form**: 
  - Change the current `motor_color` text input to a **Dropdown Select**.
  - Populate the dropdown dynamically based on the selected motor's `available_colors`.

## 2. Inventory Management (Frame & Engine Numbers)
In a dealer system, Frame and Engine numbers are unique to a **specific unit**, not the model.

### Technical Plan:
- **Separation of Concerns**: 
  - `motors` table: Stores model-level data (Price, Year, Brand, Colors).
  - `transactions` table: Stores sale-level data (Unit specific info).
- **Workflow**:
  1. **Order placement**: Customer selects model and color (No Frame/Engine number yet).
  2. **Payment Confirmation**: Admin confirms payment/booking.
  3. **Unit Allocation**: Admin goes to the Transaction Detail, checks physical stock, and assigns the unique `frame_number` and `engine_number` to that transaction.
  4. **handover**: Customer receives the unit with the assigned technical data.

## 3. Implementation Steps (Phased)
1. **Migration**: Create migration to add `available_colors` to `motors`.
2. **Admin Update**: Modify [MotorController](file:///d:/laragon/www/SrbMotor/app/Http/Controllers/MotorController.php#16-180) and `Admin/Motors` frontend.
3. **FE Update**: Modify [CashOrderForm.jsx](file:///d:/laragon/www/SrbMotor/resources/js/Pages/Motors/CashOrderForm.jsx) to fetch and display colors as a dropdown.
4. **Maintenance**: Ensure existing transactions remain valid.

> [!TIP]
> This approach keeps the catalog clean while ensuring every sale is tracked to a specific physical unit, matching real-world dealer operations.
