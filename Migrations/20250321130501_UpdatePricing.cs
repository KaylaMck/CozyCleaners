using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CozyCleaners.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePricing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "a7d3af36-1784-4e4b-a18a-547616f2284a",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "a75132d5-9a2f-45f8-a241-d464ad2fbd13", "AQAAAAIAAYagAAAAEBtvlBEyPpgKma9IbyEhkG6BFSEjBKAF9QUeslOg8ebETYfR+HUYJ2gINBIWCowTnw==", "ad6e8b84-7aeb-4ccd-81c3-10a4d3d60689" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "997fb451-f9f3-4ebd-9a5a-1e36d13f43ab", "AQAAAAIAAYagAAAAEPfCtQ+TzRd1/QtSx3wT2WnAOHOxoIeTKuzkunEhtsVhC0Hggbse60mknzc9S7sfgw==", "9a86d138-95e0-475f-acb4-0da07d96c8e7" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e31d1fe4-7fb6-4129-a1c9-f9f9a3127212",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "1d10ebf1-39c1-484c-bc40-8109db59f205", "AQAAAAIAAYagAAAAEKrn2p4PQyjRGACWMjxUJpMA4e8JDx6D5JgKzbzhl/2Oecki4Ohiits2ZnKLOu5fmg==", "d71006fa-ed9b-427c-aee3-c38fe40a68be" });

            migrationBuilder.UpdateData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 100,
                column: "Date",
                value: new DateTime(2025, 3, 24, 8, 5, 0, 790, DateTimeKind.Local).AddTicks(5028));

            migrationBuilder.UpdateData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 101,
                column: "Date",
                value: new DateTime(2025, 3, 11, 8, 5, 0, 790, DateTimeKind.Local).AddTicks(5084));

            migrationBuilder.UpdateData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 102,
                column: "Date",
                value: new DateTime(2025, 3, 16, 8, 5, 0, 790, DateTimeKind.Local).AddTicks(5088));

            migrationBuilder.UpdateData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 1,
                column: "Price",
                value: 100.00m);

            migrationBuilder.UpdateData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 2,
                column: "Price",
                value: 175.00m);

            migrationBuilder.UpdateData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 3,
                column: "Price",
                value: 250.00m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "a7d3af36-1784-4e4b-a18a-547616f2284a",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "5c014edb-c243-409b-bac0-e0126e3daa43", "AQAAAAIAAYagAAAAEOO5eDO76XA2kIbf2r5mZRdqretKtYtjh27OxiILWmFooRxLbX75oM6WcDJI00C7YQ==", "41a2cf1a-3e66-48a9-b1f2-720b8e919db3" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "05e2f23b-9107-44f1-9471-65abd1611351", "AQAAAAIAAYagAAAAELm7ZuKwYyuFbBdK2JkHRDq7KcF9objtYLeRkStbz7fkcs5mboV7P/Kw2gI8AUAz3w==", "b3cd9d3c-eed4-47fb-ba1c-f0a00cb9cef7" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e31d1fe4-7fb6-4129-a1c9-f9f9a3127212",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "fc528b1b-eacc-451f-a5d5-35a72830f489", "AQAAAAIAAYagAAAAEK+2OagY4jE+gWggCbQPSXynHvh+NevAneb3pOdbs6P/BQNaC+zFklZNIulmknc4Ig==", "451b7d70-ad38-4a7c-b9c1-e51ff42ab963" });

            migrationBuilder.UpdateData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 100,
                column: "Date",
                value: new DateTime(2025, 3, 22, 0, 34, 58, 645, DateTimeKind.Local).AddTicks(1845));

            migrationBuilder.UpdateData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 101,
                column: "Date",
                value: new DateTime(2025, 3, 9, 0, 34, 58, 645, DateTimeKind.Local).AddTicks(1956));

            migrationBuilder.UpdateData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 102,
                column: "Date",
                value: new DateTime(2025, 3, 14, 0, 34, 58, 645, DateTimeKind.Local).AddTicks(1958));

            migrationBuilder.UpdateData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 1,
                column: "Price",
                value: 50.00m);

            migrationBuilder.UpdateData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 2,
                column: "Price",
                value: 100.00m);

            migrationBuilder.UpdateData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 3,
                column: "Price",
                value: 150.00m);
        }
    }
}
