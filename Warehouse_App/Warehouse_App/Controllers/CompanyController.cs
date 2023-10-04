using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;
using Warehouse_App.Dtos;
using Warehouse_App.Models;
using Warehouse_App.Repos;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Warehouse_App.Controllers
{
    [Route("api/companies")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyRepo repo;

        public CompanyController(ICompanyRepo repository)
        {
            repo = repository;
        }

        // GET: api/<CompanyController>
        [HttpGet]
        public async Task<IEnumerable<CompanyDto>> Get()
        {
            var result = await repo.GetMany();
            return result.Select(r => new CompanyDto(r.name, r.city, r.address, r.owner, r.email, r.created));
        }

        // GET api/<CompanyController>/5
        [HttpGet]
        [Route("{companyId}", Name = "GetCompany")]
        public async Task<ActionResult<CompanyDto>> Get(int companyId)
        {
            var result = await repo.GetOne(companyId);

            if(result == null)
            {
                return NotFound();
            }
            return new CompanyDto(result.name, result.city, result.address, result.owner, result.email, result.created);
        }

        // POST api/<CompanyController>
        [HttpPost]
        public async Task<ActionResult<CompanyDto>> Post(CreateCompanyDto createCompanyDto)
        {
            var result = new Company { name = createCompanyDto.name, city = createCompanyDto.city, address = createCompanyDto.address, owner = createCompanyDto.owner, email = createCompanyDto.email, created = DateTime.Now };
            await repo.Create(result);

            return CreatedAtRoute("GetCompany", new { companyId = result.companyId }, result);
        }

        // PUT api/<CompanyController>/5
        [HttpPut("{companyId}")]
        public async Task<ActionResult<CompanyDto>> Put(int companyId, EditCompanyDto editCompanyDto)
        {
            var result = await repo.GetOne(companyId);

            if (result == null)
            {
                return NotFound();
            }

            result.name = editCompanyDto.name;
            result.city = editCompanyDto.city;
            result.address = editCompanyDto.address;
            result.owner = editCompanyDto.owner;
            result.email = editCompanyDto.email;

            await repo.Update(result);

            return Ok(new CompanyDto(result.name, result.city, result.address, result.owner, result.email, result.created));

        }

        // DELETE api/<CompanyController>/5
        [HttpDelete("{companyId}")]
        public async Task<ActionResult> Delete(int companyId)
        {
            var result = await repo.GetOne(companyId);

            if (result == null)
            {
                return NotFound();
            }

            await repo.Delete(result);

            return NoContent();

        }
    }
}
