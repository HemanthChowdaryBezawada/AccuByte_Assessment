# Test Report
**Date**: 2025-12-13
**Tests Passed**: 17/17
**Status**: SUCCESS

## Details

### UserService
- [x] should register a new user successfully
- [x] should throw error if user already exists during registration
- [x] should login user successfully with correct credentials
- [x] should throw error for invalid credentials

### InventoryService
- [x] should add a sweet to the inventory
- [x] should list all sweets
- [x] should remove a sweet from the inventory
- [x] should restock an existing sweet
- [x] should throw error when restocking with invalid quantity

### PurchaseService
- [x] should purchase a sweet successfully
- [x] should throw error if sweet not found
- [x] should throw error for invalid quantity
- [x] should throw error for insufficient stock

### SearchService
- [x] should search sweets by name
- [x] should search sweets by category
- [x] should sort sweets by price ascending

### Sweet Entity
- [x] should create a Sweet instance with correct properties
