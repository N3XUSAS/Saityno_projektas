using System.ComponentModel.DataAnnotations;

namespace Warehouse_App.Dtos
{
    public record OrderDto(int id, string code, string deliveryCity, string deliveryAddress, double weight, string size, string phone, DateTime created);
    public record CreateEditOrderDto(
        [Required][RegularExpression(@"^[a-zA-Z -]+$", ErrorMessage = "Only letters are allowed")][MaxLength(25, ErrorMessage = "Maximum 25 symbols are allowed")] string deliveryCity,
        [Required][MaxLength(50, ErrorMessage = "Maximum 50 symbols are allowed")] string deliveryAddress,
        [Required][Range(0.01, 99999.99, ErrorMessage = "Value is too small/big")]double weight,
        [Required][RegularExpression(@"^[A-Z]+$", ErrorMessage = "Only roman numerals are allowed")][MaxLength(3, ErrorMessage = "Maximum 3 symbols are allowed")]string size,
        [Required][Phone(ErrorMessage = "Invalid phone")]string phone);
}


