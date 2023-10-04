using System;
using Warehouse_App.Models;
using Warehouse_App;
using Microsoft.EntityFrameworkCore;

namespace Warehouse_App.Repos;

public interface ICompanyRepo
{
    Task Create(Company company);
    Task Delete(Company company);
    Task<IReadOnlyList<Company>> GetMany();
    Task<Company> GetOne(global::System.Int32 id);
    Task Update(Company company);
}

public class CompanyRepo : ICompanyRepo
{
    private readonly AppDB appDB;

    public CompanyRepo(AppDB DB)
    {
        appDB = DB;
    }

    public async Task<Company?> GetOne(int id)
    {
        return await appDB.Companies.FirstOrDefaultAsync(t => t.companyId == id);
    }

    public async Task<IReadOnlyList<Company>> GetMany()
    {
        return await appDB.Companies.ToListAsync();
    }

    public async Task Create(Company company)
    {
        appDB.Companies.Add(company);
        await appDB.SaveChangesAsync();
    }

    public async Task Update(Company company)
    {
        appDB.Companies.Update(company);
        await appDB.SaveChangesAsync();
    }

    public async Task Delete(Company company)
    {
        appDB.Companies.Remove(company);
        await appDB.SaveChangesAsync();
    }

}
