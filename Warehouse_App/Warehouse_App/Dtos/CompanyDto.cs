using System;

public record CompanyDto(string name, string city, string address, string owner, string email, DateTime created);
public record CreateCompanyDto(string name, string city, string address, string owner, string email);
public record EditCompanyDto(string name, string city, string address, string owner, string email);
