using System.ComponentModel.DataAnnotations;

namespace Warehouse_App.Dtos
{
    public record RegisterUserDto(
        [Required][RegularExpression(@"^[a-zA-Z -]+$", ErrorMessage = "Only letters are allowed")][MaxLength(40, ErrorMessage = "Maximum 40 symbols are allowed")] string companyName,
        [Required][RegularExpression(@"^[a-zA-Z -]+$", ErrorMessage = "Only letters are allowed")][MaxLength(20, ErrorMessage = "Maximum 20 symbols are allowed")] string name, 
        [Required][RegularExpression(@"^[a-zA-Z -]+$", ErrorMessage = "Only letters are allowed")][MaxLength(20, ErrorMessage = "Maximum 20 symbols are allowed")] string surname, 
        [Required][EmailAddress(ErrorMessage = "Invalid email")] string email, 
        [Required][Range(0, int.MaxValue)] int companyId, 
        [Required][RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d!@#$%^&*()_+]{10,}$", ErrorMessage = "Password should contain at least 1 capital letter, 1 special letter, 1 spcial symbol and minimum 10 symbols")][MaxLength(40, ErrorMessage = "Maximum 40 symbols are allowed")] string password);

    public record RegisterCompanyUserDto(
        [Required][RegularExpression(@"^[a-zA-Z -]+$", ErrorMessage = "Only letters are allowed")][MaxLength(40, ErrorMessage = "Maximum 40 symbols are allowed")] string name,
        [Required][RegularExpression(@"^[a-zA-Z -]+$", ErrorMessage = "Only letters are allowed")][MaxLength(20, ErrorMessage = "Maximum 20 symbols are allowed")] string companyName,
        [Required][RegularExpression(@"^[a-zA-Z -]+$", ErrorMessage = "Only letters are allowed")][MaxLength(20, ErrorMessage = "Maximum 20 symbols are allowed")] string surname,
        [Required][EmailAddress(ErrorMessage = "Invalid email")] string email,
        [Required][RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d!@#$%^&*()_+]{10,}$", ErrorMessage = "Password should contain at least 1 capital letter, 1 special letter, 1 spcial symbol and minimum 10 symbols")][MaxLength(40, ErrorMessage = "Maximum 40 symbols are allowed")] string password);

    public record LoginUserDto([Required] string username, [Required] string password);

    public record UserDto(string Id, string username, string email, string name, string surname);

    public record SuccesfullLoginDto(string accessToken, string refreshToken);

    public record RefreshAccessTokenDto(string refreshToken);

    public record UserGetAdminDto(string Id, string username, string email, int companyId, string name, string surname, string companyName);
}

//[Required][RegularExpression(@"^[a-zA-Z -]+$", ErrorMessage = "Only letters are allowed")][MaxLength(40, ErrorMessage = "Maximum 40 symbols are allowed")] string name,

//   [Required][RegularExpression(@"^[a-zA-Z -]+$", ErrorMessage = "Only letters are allowed")][MaxLength(25, ErrorMessage = "Maximum 25 symbols are allowed")] string city,

//   [Required][MaxLength(50, ErrorMessage = "Maximum 50 symbols are allowed")] string address,

//   [Required][RegularExpression(@"^[a-zA-Z -]+$", ErrorMessage = "Only letters are allowed")][MaxLength(40, ErrorMessage = "Maximum 40 symbols are allowed")] string owner,

//   [Required][EmailAddress(ErrorMessage = "Invalid email")] string email);