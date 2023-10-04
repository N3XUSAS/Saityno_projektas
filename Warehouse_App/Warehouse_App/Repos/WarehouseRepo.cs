using System;
using Warehouse_App.Models;
using Warehouse_App;
using Microsoft.EntityFrameworkCore;

namespace Warehouse_App.Repos;

public interface IWarehouseRepo
{
    Task Create(Warehouse warehouse);
    Task Delete(Warehouse warehouse);
    Task<IReadOnlyList<Warehouse>> GetMany(int id);
    //Task<Warehouse> GetOne(int warehouseId, int companyId);
    Task Update(Warehouse warehouse);
}

public class WarehouseRepo : IWarehouseRepo
{
    private readonly AppDB appDB;

    public WarehouseRepo(AppDB DB)
    {
        appDB = DB;
    }

    public async Task<Company?> GetCompany(int id)
    {
        return await appDB.Companies.FirstOrDefaultAsync(t => t.companyId == id);
    }

    //public async Task<Warehouse?> GetOne(int warehouseId, int companyId)
    //{
        

         
    //}

    public async Task<IReadOnlyList<Warehouse>> GetMany(int id)
    {
        //return await appDB.Warehouses.ToListAsync();
        return await appDB.Warehouses.Where(w => w.Company.companyId == id).ToListAsync();
    }

    public async Task Create(Warehouse warehouse)
    {
        appDB.Warehouses.Add(warehouse);
        await appDB.SaveChangesAsync();
    }

    public async Task Update(Warehouse warehouse)
    {
        appDB.Warehouses.Update(warehouse);
        await appDB.SaveChangesAsync();
    }

    public async Task Delete(Warehouse warehouse)
    {
        appDB.Warehouses.Remove(warehouse);
        await appDB.SaveChangesAsync();
    }

}
