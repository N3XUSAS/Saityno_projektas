using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;
using Warehouse_App.Dtos;
using Warehouse_App.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Warehouse_App.Controllers
{
    [Route("api/companies")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly AppDB appDB;

        public CompanyController(AppDB DB)
        {
            appDB = DB;
        }

        // GET: api/<CompanyController>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<CompanyDto>> Get()
        {
            var result = await appDB.Companies.ToListAsync();
            return result.Select(r => new CompanyDto(r.companyId, r.name, r.city, r.address, r.owner, r.email, r.created));
        }

        // GET api/<CompanyController>/5
        [HttpGet]
        [Route("{companyId}", Name = "GetCompany")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CompanyDto>> Get(int companyId)
        {
            var result = await appDB.Companies.FirstOrDefaultAsync(c => c.companyId == companyId);

            if (result == null)
            {
                return NotFound("Company does not exist");
            }
            return new CompanyDto(result.companyId, result.name, result.city, result.address, result.owner, result.email, result.created);
        }

        // POST api/<CompanyController>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CompanyDto>> Post(CreateCompanyDto createCompanyDto)
        {
            if(ModelState.IsValid)
            {
                var result = new Company { name = createCompanyDto.name, city = createCompanyDto.city, address = createCompanyDto.address, owner = createCompanyDto.owner, email = createCompanyDto.email, created = DateTime.Now };
                appDB.Companies.Add(result);
                await appDB.SaveChangesAsync();

                return CreatedAtRoute("GetCompany", new { companyId = result.companyId }, result);
            }
            else
            {
                return UnprocessableEntity("Wrong data");
            }
            
        }

        // PUT api/<CompanyController>/5
        [HttpPut("{companyId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CompanyDto>> Put(int companyId, EditCompanyDto editCompanyDto)
        {
            var result = await appDB.Companies.FirstOrDefaultAsync(c => c.companyId == companyId);

            if (result == null)
            {
                return NotFound("Company does not exist");
            }
            else if (ModelState.IsValid)
            { 
                result.name = editCompanyDto.name;
                result.city = editCompanyDto.city;
                result.address = editCompanyDto.address;
                result.owner = editCompanyDto.owner;
                result.email = editCompanyDto.email;
            
                appDB.Companies.Update(result);
                await appDB.SaveChangesAsync();

                return Ok(new CompanyDto(result.companyId, result.name, result.city, result.address, result.owner, result.email, result.created));
            }
            else
            {
                return UnprocessableEntity("");
            }

        }

        // DELETE api/<CompanyController>/5
        [HttpDelete("{companyId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Delete(int companyId)
        {
            var result = await appDB.Companies.FirstOrDefaultAsync(c => c.companyId == companyId);
            if (result == null)
            {
                return NotFound("Company does not exist");
            }
            else
            {
                appDB.Companies.Remove(result);
                await appDB.SaveChangesAsync();
                return NoContent();
            }
        }
    }
}
