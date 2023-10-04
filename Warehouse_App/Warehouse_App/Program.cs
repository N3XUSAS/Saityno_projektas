using Microsoft.EntityFrameworkCore;
using Warehouse_App;
using Warehouse_App.Repos;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<AppDB>(option => { option.UseSqlServer(builder.Configuration.GetConnectionString("defaultSQLConnection")); });

builder.Services.AddControllers();
builder.Services.AddTransient<ICompanyRepo, CompanyRepo>();
builder.Services.AddTransient<IWarehouseRepo, WarehouseRepo>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
