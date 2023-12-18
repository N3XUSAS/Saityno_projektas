using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Warehouse_App.Models;
using Warehouse_App.Dtos;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Warehouse_App.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly AppDB appDB;

        public AuthController(UserManager<User> userManager, IJwtTokenService jwtTokenService, AppDB DB)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            appDB = DB;
        }

        [HttpPost]
        [Authorize(Roles = Roles.SystemAdmin)]
        [Route("register")]
        public async Task<IActionResult> Register(RegisterUserDto registerUserDto)
        {
            bool flag = false;
            string username = "";
            int cnt = 0;
            while (!flag)
            {
                if(cnt != 0)
                {
                    username = cnt.ToString() + registerUserDto.name.Substring(0, 3).ToLower() + registerUserDto.surname.Substring(0, 3).ToLower();
                }
                else
                {
                    username = registerUserDto.name.Substring(0, 3).ToLower() + registerUserDto.surname.Substring(0, 3).ToLower();
                }
                var user = await _userManager.FindByNameAsync(username);
                if(user == null)
                {
                    flag = true;
                }
                else
                {
                    cnt++;
                }
            }

            var newUser = new User
            {
                Email = registerUserDto.email,
                UserName = username,
                CompanyId = registerUserDto.companyId,
                Name = registerUserDto.name,
                Surname = registerUserDto.surname,
                CompanyName = registerUserDto.companyName,
            };

            var createUserResult = await _userManager.CreateAsync(newUser, registerUserDto.password);

            if (!createUserResult.Succeeded)
            {
                return BadRequest("Error creating new user");
            }

            await _userManager.AddToRoleAsync(newUser, Roles.CompanyAdmin);

            return CreatedAtAction(nameof(Register), new UserDto(newUser.Id, newUser.UserName, newUser.Email, newUser.Name, newUser.Surname));
        }

        [HttpPost]
        [Authorize(Roles = Roles.CompanyAdmin)]
        [Route("registerForCompany")]
        public async Task<IActionResult> RegisterForCompany(RegisterCompanyUserDto registerUserDto)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var user = await _userManager.FindByIdAsync(userId);
            bool flag = false;
            string username = "";
            int cnt = 0;
            while (!flag)
            {
                if (cnt != 0)
                {
                    username = cnt.ToString() + registerUserDto.name.Substring(0, 3).ToLower() + registerUserDto.surname.Substring(0, 3).ToLower();
                }
                else
                {
                    username = registerUserDto.name.Substring(0, 3).ToLower() + registerUserDto.surname.Substring(0, 3).ToLower();
                }
                var addedUser = await _userManager.FindByNameAsync(username);
                if (addedUser == null)
                {
                    flag = true;
                }
                else
                {
                    cnt++;
                }
            }

            var newUser = new User
            {
                Email = registerUserDto.email,
                UserName = username,
                CompanyId = user.CompanyId,
                Name = registerUserDto.name,
                Surname = registerUserDto.surname,
                CompanyName = user.CompanyName,
            };

            var createUserResult = await _userManager.CreateAsync(newUser, registerUserDto.password);

            if (!createUserResult.Succeeded)
            {
                return BadRequest("Error creating new user");
            }

            await _userManager.AddToRoleAsync(newUser, Roles.CompanyAdmin);

            return CreatedAtAction(nameof(Register), new UserDto(newUser.Id, newUser.UserName, newUser.Email, newUser.Name, newUser.Surname));
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("login")]
        public async Task<IActionResult> Login(LoginUserDto loginUserDto)
        {
            var user = await _userManager.FindByNameAsync(loginUserDto.username);
            if (user == null) 
            {
                return BadRequest("Invalid username or password");
            }

            var validPassword = await _userManager.CheckPasswordAsync(user, loginUserDto.password);
            if (validPassword == false)
            {
                return BadRequest("Invalid username or password");
            }

            var roles = await _userManager.GetRolesAsync(user);

            user.ForceRelogin = false;

            await _userManager.UpdateAsync(user);

            var accessToken = _jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
            var refreshToken = _jwtTokenService.CreateRefreshToken(user.Id);

            return Ok(new SuccesfullLoginDto(accessToken, refreshToken));
        }
        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> RefreshToken(RefreshAccessTokenDto refreshAccessTokenDto)
        {
            if(!_jwtTokenService.TryParseRefreshToken(refreshAccessTokenDto.refreshToken, out var claims))
            {
                return BadRequest("");
            }

            var userId = claims.FindFirstValue(JwtRegisteredClaimNames.Sub);

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return BadRequest();
            }

            if (user.ForceRelogin)
            {
                return BadRequest();
            }
            var roles = await _userManager.GetRolesAsync(user);

            var accessToken = _jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
            var refreshToken = _jwtTokenService.CreateRefreshToken(user.Id);

            return Ok(new SuccesfullLoginDto(accessToken, refreshToken));

        }

        [HttpGet]
        [Route("getAll")]
        [Authorize(Roles = Roles.SystemAdmin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<UserGetAdminDto>> GetAll()
        {
            var result = await appDB.AspNetUsers.ToListAsync();
            return result.Select(r => new UserGetAdminDto(r.Id, r.UserName, r.Email, r.CompanyId, r.Name, r.Surname, r.CompanyName));
        }

        [HttpGet]
        [Route("getCompany")]
        [Authorize(Roles = Roles.CompanyAdmin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCompany()
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var user = await _userManager.FindByIdAsync(userId);
            var company = await appDB.Companies.FindAsync(user.CompanyId);
            if (company == null)
            {
                return NotFound("Company does not exist");
            }
            else
            {
                var result = await appDB.AspNetUsers.Where(w => w.CompanyId == user.CompanyId)
                                                    .Select(w => new UserDto(w.Id, w.UserName, w.Email, w.Name, w.Surname))
                                                    .ToListAsync();
                return Ok(result);
            }
        }

        [HttpGet]
        [Route("getOne")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserGetAdminDto>> GetOne()
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if(userId == null)
            {
                return BadRequest();
            }
            var user = await _userManager.FindByIdAsync(userId);
            return new UserGetAdminDto(user.Id, user.UserName, user.Email, user.CompanyId, user.Name, user.Surname, user.CompanyName);
        }

        [HttpDelete("{delUserId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(string delUserId)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var user = await _userManager.FindByIdAsync(userId);
            var deletedUser = await _userManager.FindByIdAsync(delUserId);
            var role = await _userManager.GetRolesAsync(user);
            if (user.CompanyId != deletedUser.CompanyId && role[0] != Roles.SystemAdmin)
            {
                return Forbid("You do not have permition for this action");
            }
            if (deletedUser == null)
            {
                return NotFound("User does not exist");
            }
            else
            {
                appDB.AspNetUsers.Remove(deletedUser);
                await appDB.SaveChangesAsync();
                return NoContent();
            }
        }
    }
}