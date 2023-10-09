using System.ComponentModel.DataAnnotations;

namespace Warehouse_App.Dtos
{
    public record WarehouseDto(
        int id,
        [Required][RegularExpression(@"^[a-zA-Z -]+$", ErrorMessage = "Only letters are allowed")][MaxLength(25, ErrorMessage = "Maximum 25 symbols are allowed")] string city,
        [Required][MaxLength(50, ErrorMessage = "Maximum 50 symbols are allowed")] string address,
        [Required][RegularExpression(@"^[a-zA-Z -]+$", ErrorMessage = "Only letters are allowed")][MaxLength(40, ErrorMessage = "Maximum 40 symbols are allowed")] string maneger);
}
