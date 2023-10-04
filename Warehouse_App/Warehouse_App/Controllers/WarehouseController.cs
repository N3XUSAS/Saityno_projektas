using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.Design;
using Warehouse_App.Dtos;
using Warehouse_App.Models;
using Warehouse_App.Repos;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Warehouse_App.Controllers
{
    [Route("api/companies/{companyId}/warehouses")]
    [ApiController]
    public class WarehouseController : ControllerBase
    {

        private readonly AppDB appDB;

        public WarehouseController(AppDB DB)
        {
            appDB = DB;
        }

        // GET: api/<WarehouseController>
        // GET: api/<CompanyController>
        [HttpGet]
        public async Task<IEnumerable<WarehouseDto>> Get([FromRoute] int companyId)
        {
            var result = await appDB.Warehouses.Where(w => w.Company.companyId == companyId).ToListAsync();
            return result.Select(w => new WarehouseDto(w.city, w.address, w.maneger));
        }

        //GET api/<CompanyController>/5
        [HttpGet]
        [Route("{warehouseId}", Name = "GetWarehouse")]
        public async Task<ActionResult<WarehouseDto>> Get(int warehouseId, [FromRoute] int companyId)
        {
            var company = await appDB.Warehouses.FindAsync(companyId);
            if (company == null)
            {
                return NotFound();
            }
            else
            {
                var result = await appDB.Warehouses.FirstOrDefaultAsync(w => w.warehouseId == warehouseId && w.Company.companyId == companyId);
                return Ok( new WarehouseDto(result.city, result.address, result.maneger));
            }
            
        }

        //POST api/<CompanyController>
        [HttpPost]
        public async Task<ActionResult<CompanyDto>> Post(WarehouseDto warehouseDto, [FromRoute] int companyId)
        {
            var company = await appDB.Companies.FirstOrDefaultAsync(c => c.companyId == companyId);
        
            var result = new Warehouse { city = warehouseDto.city, address = warehouseDto.address, maneger = warehouseDto.maneger, Company = company };
            appDB.Warehouses.Add(result);
            await appDB.SaveChangesAsync();

            return CreatedAtRoute("GetWarehouse", new { warehouseId = result.warehouseId, companyId = companyId}, result);
        }

        // PUT api/<CompanyController>/5
        [HttpPut("{warehouseId}")]
        public async Task<ActionResult<WarehouseDto>> Put(int warehouseId, [FromRoute] int companyId, WarehouseDto warehouseDto)
        {
            var company = await appDB.Warehouses.FindAsync(companyId);
            if (company == null)
            {
                return NotFound();
            }
            else
            {
                var result = await appDB.Warehouses.FirstOrDefaultAsync(w => w.warehouseId == warehouseId && w.Company.companyId == companyId);
                if (result == null)
                {
                    return NotFound();
                }
                else
                {
                    result.city = warehouseDto.city;
                    result.address = warehouseDto.address;
                    result.maneger = warehouseDto.maneger;

                    appDB.Warehouses.Update(result);
                    await appDB.SaveChangesAsync();

                    return Ok(new WarehouseDto(result.city, result.address, result.maneger));
                }
            }
        }

        //// DELETE api/<CompanyController>/5
        [HttpDelete("{warehouseId}")]
        public async Task<ActionResult> Delete(int warehouseId, [FromRoute] int companyId)
        {
            var company = await appDB.Warehouses.FindAsync(companyId);
            if (company == null)
            {
                return NotFound();
            }
            else
            {
                var result = await appDB.Warehouses.FirstOrDefaultAsync(w => w.warehouseId == warehouseId && w.Company.companyId == companyId);
                if (result == null)
                {
                    return NotFound();
                }
                else
                {
                    appDB.Warehouses.Remove(result);
                    await appDB.SaveChangesAsync();

                    return NoContent();
                }
            }

        }
    }
}
