public class Admin extends User {
    int AdminPrivilege; // lower privilege higher admin most high -> xkraltr 1
    public Admin(String username, String password, String name, String surName,  String gender , String mail , String birthDate){
        this.username = username;
        this.password = password;
        this.name = name;
        this.surName = surName;
        this.gender = gender;
        this.mail = mail;
        this.birthDate = birthDate;
    }
    public Admin(String username, String password, String name, String surName,  String gender , String mail , String birthDate , int adminpriv){
        this.username = username;
        this.password = password;
        this.name = name;
        this.surName = surName;
        this.gender = gender;
        this.mail = mail;
        this.birthDate = birthDate;
        this.AdminPrivilege= adminpriv;
    }
    public int getAdminPrivilege() {
        return AdminPrivilege;
    }
    public void setAdminPrivilege(int adminPrivilege) {
        this.AdminPrivilege = adminPrivilege;
    }
}
