public class User{

    String username , password , name , surName , gender , mail , birthDate;

    // CONSTRUCTER
    public User(){
        this.username = "DEFAULT_username";
        this.password = "DEFAULT_password";
        this.name = "DEFAULT_name";
        this.surName = "DEFAULT_surName";
        this.gender = "DEFAULT_gender";
        this.mail = "DEFAULT_mail";
        this.birthDate = "DEFAULT_birthDate";
    }
    public User(String username, String password, String name, String surName,  String gender , String mail , String birthDate){
        this.username = username;
        this.password = password;
        this.name = name;
        this.surName = surName;
        this.gender = gender;
        this.mail = mail;
        this.birthDate = birthDate;
    }

    // GETTERS AND SETTERS
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getSurName() {
        return surName;
    }
    public void setSurName(String surName) {
        this.surName = surName;
    }
    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
    public String getMail() {
        return mail;
    }
    public void setMail(String mail) {
        this.mail = mail;
    }
    public String getBirthDate() {
        return birthDate;
    }
    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

}