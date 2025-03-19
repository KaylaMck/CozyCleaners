using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CozyCleaners.Migrations
{
    /// <inheritdoc />
    public partial class CompleteDataSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RequestServices",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "RequestServices",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "RequestServices",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "RequestServices",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "RequestServices",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "RequestServices",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "UserAddresses",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "UserAddresses",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.CreateTable(
                name: "ClaimedRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RequestId = table.Column<int>(type: "integer", nullable: false),
                    CleanerId = table.Column<int>(type: "integer", nullable: false),
                    ClaimedTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClaimedRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClaimedRequests_CleaningRequests_RequestId",
                        column: x => x.RequestId,
                        principalTable: "CleaningRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClaimedRequests_UserProfiles_CleanerId",
                        column: x => x.CleanerId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
                column: "NormalizedName",
                value: "ADMIN");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "06bb4a33-d197-4991-bd9e-9c130e387cca", null, "Cleaner", "CLEANER" },
                    { "ff4f7ced-cad4-4035-9dd1-2e39ada7f83b", null, "Client", "CLIENT" }
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "EmailConfirmed", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "SecurityStamp" },
                values: new object[] { "05e2f23b-9107-44f1-9471-65abd1611351", true, "ADMINA@STRATOR.COMX", "ADMINISTRATOR", "AQAAAAIAAYagAAAAELm7ZuKwYyuFbBdK2JkHRDq7KcF9objtYLeRkStbz7fkcs5mboV7P/Kw2gI8AUAz3w==", "b3cd9d3c-eed4-47fb-ba1c-f0a00cb9cef7" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e31d1fe4-7fb6-4129-a1c9-f9f9a3127212",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "fc528b1b-eacc-451f-a5d5-35a72830f489", "AQAAAAIAAYagAAAAEK+2OagY4jE+gWggCbQPSXynHvh+NevAneb3pOdbs6P/BQNaC+zFklZNIulmknc4Ig==", "451b7d70-ad38-4a7c-b9c1-e51ff42ab963" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "a7d3af36-1784-4e4b-a18a-547616f2284a", 0, "5c014edb-c243-409b-bac0-e0126e3daa43", "cleaner@cozy.com", true, false, null, "CLEANER@COZY.COM", "CLEANER@COZY.COM", "AQAAAAIAAYagAAAAEOO5eDO76XA2kIbf2r5mZRdqretKtYtjh27OxiILWmFooRxLbX75oM6WcDJI00C7YQ==", null, false, "41a2cf1a-3e66-48a9-b1f2-720b8e919db3", false, "cleaner@cozy.com" });

            migrationBuilder.InsertData(
                table: "Statuses",
                columns: new[] { "Id", "Title" },
                values: new object[] { 4, "In Progress" });

            migrationBuilder.InsertData(
                table: "UserAddresses",
                columns: new[] { "Id", "City", "State", "Street", "UserProfileId", "ZipCode" },
                values: new object[] { 100, "Nashville", "TN", "123 Main Street", 2, "37203" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "06bb4a33-d197-4991-bd9e-9c130e387cca", "a7d3af36-1784-4e4b-a18a-547616f2284a" },
                    { "ff4f7ced-cad4-4035-9dd1-2e39ada7f83b", "e31d1fe4-7fb6-4129-a1c9-f9f9a3127212" }
                });

            migrationBuilder.InsertData(
                table: "CleaningRequests",
                columns: new[] { "Id", "AddressId", "ClientId", "Date", "StatusId", "TimeSlotId" },
                values: new object[,]
                {
                    { 100, 100, 2, new DateTime(2025, 3, 22, 0, 34, 58, 645, DateTimeKind.Local).AddTicks(1845), 1, 1 },
                    { 101, 100, 2, new DateTime(2025, 3, 9, 0, 34, 58, 645, DateTimeKind.Local).AddTicks(1956), 2, 2 },
                    { 102, 100, 2, new DateTime(2025, 3, 14, 0, 34, 58, 645, DateTimeKind.Local).AddTicks(1958), 3, 3 }
                });

            migrationBuilder.InsertData(
                table: "UserProfiles",
                columns: new[] { "Id", "FirstName", "IdentityUserId", "LastName" },
                values: new object[] { 3, "Cleaner", "a7d3af36-1784-4e4b-a18a-547616f2284a", "Demo" });

            migrationBuilder.InsertData(
                table: "RequestServices",
                columns: new[] { "Id", "Quantity", "RequestId", "ServiceId" },
                values: new object[,]
                {
                    { 100, 1, 100, 1 },
                    { 101, 1, 101, 2 },
                    { 102, 1, 102, 3 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClaimedRequests_CleanerId",
                table: "ClaimedRequests",
                column: "CleanerId");

            migrationBuilder.CreateIndex(
                name: "IX_ClaimedRequests_RequestId",
                table: "ClaimedRequests",
                column: "RequestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClaimedRequests");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "06bb4a33-d197-4991-bd9e-9c130e387cca", "a7d3af36-1784-4e4b-a18a-547616f2284a" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "ff4f7ced-cad4-4035-9dd1-2e39ada7f83b", "e31d1fe4-7fb6-4129-a1c9-f9f9a3127212" });

            migrationBuilder.DeleteData(
                table: "RequestServices",
                keyColumn: "Id",
                keyValue: 100);

            migrationBuilder.DeleteData(
                table: "RequestServices",
                keyColumn: "Id",
                keyValue: 101);

            migrationBuilder.DeleteData(
                table: "RequestServices",
                keyColumn: "Id",
                keyValue: 102);

            migrationBuilder.DeleteData(
                table: "Statuses",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "UserProfiles",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "06bb4a33-d197-4991-bd9e-9c130e387cca");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ff4f7ced-cad4-4035-9dd1-2e39ada7f83b");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "a7d3af36-1784-4e4b-a18a-547616f2284a");

            migrationBuilder.DeleteData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 100);

            migrationBuilder.DeleteData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 101);

            migrationBuilder.DeleteData(
                table: "CleaningRequests",
                keyColumn: "Id",
                keyValue: 102);

            migrationBuilder.DeleteData(
                table: "UserAddresses",
                keyColumn: "Id",
                keyValue: 100);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
                column: "NormalizedName",
                value: "admin");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "EmailConfirmed", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "SecurityStamp" },
                values: new object[] { "2199a392-f552-4ccb-8664-edcc5e71612c", false, null, null, "AQAAAAIAAYagAAAAEFC/2jatFWVcxK4n2CoJzVaAQkvLE1V3m80p5MvE5srggN/BqO+1V9aUG8V2VIEXsA==", "5d6cbb78-54ee-4140-b9df-780ad7d779d8" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e31d1fe4-7fb6-4129-a1c9-f9f9a3127212",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "d70b8380-3a74-4ba7-8cee-65d996b82c0d", "AQAAAAIAAYagAAAAELDDFLwnalgaUuoUcJhAvg/bU1f65YP36A40zffn9Uj7nhnIOSnSvorwc0r0wXmYRA==", "2dcc4cb4-817b-43b3-8720-fac8e0771cf9" });

            migrationBuilder.InsertData(
                table: "UserAddresses",
                columns: new[] { "Id", "City", "State", "Street", "UserProfileId", "ZipCode" },
                values: new object[,]
                {
                    { 1, "Nashville", "TN", "123 Main Street", 2, "37203" },
                    { 2, "Nashville", "TN", "456 Broadway", 2, "37201" }
                });

            migrationBuilder.InsertData(
                table: "CleaningRequests",
                columns: new[] { "Id", "AddressId", "ClientId", "Date", "StatusId", "TimeSlotId" },
                values: new object[,]
                {
                    { 1, 1, 2, new DateTime(2025, 3, 8, 22, 59, 59, 596, DateTimeKind.Local).AddTicks(5153), 1, 1 },
                    { 2, 2, 2, new DateTime(2025, 3, 12, 22, 59, 59, 596, DateTimeKind.Local).AddTicks(5197), 1, 2 },
                    { 3, 1, 2, new DateTime(2025, 2, 23, 22, 59, 59, 596, DateTimeKind.Local).AddTicks(5199), 2, 3 },
                    { 4, 2, 2, new DateTime(2025, 2, 13, 22, 59, 59, 596, DateTimeKind.Local).AddTicks(5201), 2, 1 },
                    { 5, 1, 2, new DateTime(2025, 2, 28, 22, 59, 59, 596, DateTimeKind.Local).AddTicks(5203), 3, 2 }
                });

            migrationBuilder.InsertData(
                table: "RequestServices",
                columns: new[] { "Id", "Quantity", "RequestId", "ServiceId" },
                values: new object[,]
                {
                    { 1, 1, 1, 1 },
                    { 2, 1, 2, 2 },
                    { 3, 1, 3, 1 },
                    { 4, 1, 3, 2 },
                    { 5, 1, 4, 3 },
                    { 6, 1, 5, 1 }
                });
        }
    }
}
