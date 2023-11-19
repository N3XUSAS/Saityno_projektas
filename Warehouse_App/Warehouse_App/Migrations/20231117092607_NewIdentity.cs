using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Warehouse_App.Migrations
{
    /// <inheritdoc />
    public partial class NewIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ForceRelogin",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ForceRelogin",
                table: "AspNetUsers");
        }
    }
}
