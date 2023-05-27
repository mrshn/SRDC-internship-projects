package com.example.server;

import java.sql.*;
import java.net.*;
import java.io.*;
import java.util.*;
import java.util.ArrayList;
import io.spring.guides.gs_producing_web_service.User;
import io.spring.guides.gs_producing_web_service.Admin;
import io.spring.guides.gs_producing_web_service.Message;
import org.springframework.stereotype.Repository;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;

@Repository
public class DataBase{
    Connection myconnection;
    public void connect(){
        try {
            Class.forName("org.postgresql.Driver");
            myconnection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/postgres","postgres", "mrshn321");
            String query = "SELECT FROM information_schema.tables WHERE table_name = \'admins\'";
            Statement stmt = myconnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            if(!rs.isBeforeFirst()){
                this.makeAdminsTable();
                this.makeUsersTable();
                this.makeMessagesTable();
                System.out.println("Finally created database successfully...");
                Admin xkrl = new Admin();
                xkrl.setUsername("xkraltr");
                xkrl.setPassword("123");
                xkrl.setName("firstAdmin");
                xkrl.setSurname("MAINADMIN");
                xkrl.setGender("MALE");
                xkrl.setMail("xkraltr@srdc.com");
                //TODO: I am not sure about the below line
                xkrl.setBirthdate(DatatypeFactory.newInstance().newXMLGregorianCalendar("2000-05-22"));
                xkrl.setAdminPrivilege(0);
                addAdmin(xkrl);
            }
            stmt.close();
            rs.close();
        }catch(Exception e){
            e.printStackTrace();
            System.exit(0);
        }
        System.out.println("Opened database successfully...");

    }
    public void makeAdminsTable(){
        Statement stmt = null;
        try{
            stmt = myconnection.createStatement();
            String query = "CREATE TABLE admins(" +
                    "username   VARCHAR(50)   PRIMARY KEY," +
                    "password   VARCHAR(50)   NOT NULL," +
                    "name       VARCHAR(50)   NOT NULL,"+
                    "surName    VARCHAR(50)   NOT NULL,"+
                    "gender     VARCHAR(50)   NOT NULL,"+
                    "mail       VARCHAR(50)   NOT NULL,"+
                    "birthDate  VARCHAR(50)   NOT NULL,"+
                    "adminprivilege integer   NOT NULL)";
            stmt.execute(query);
            stmt.close();
        }catch(Exception e){
            e.printStackTrace();
            System.exit(0);
        }
        System.out.println("admins table created successfully...");
    }
    public void makeUsersTable(){
        Statement stmt = null;
        try{
            stmt = myconnection.createStatement();
            String query = "CREATE TABLE users(" +
                    "username   VARCHAR(50)  PRIMARY KEY," +
                    "password   VARCHAR(50)  NOT NULL," +
                    "name       VARCHAR(50)  NOT NULL,"+
                    "surName    VARCHAR(50)  NOT NULL,"+
                    "gender     VARCHAR(50)  NOT NULL,"+
                    "mail       VARCHAR(50)  NOT NULL,"+
                    "birthDate  VARCHAR(50)  NOT NULL)";
            stmt.execute(query);
            stmt.close();
        }catch(Exception e){
            e.printStackTrace();
            System.exit(0);
        }
        System.out.println("users table created successfully...");
    }
    public void makeMessagesTable(){
        Statement stmt = null;
        try{
            stmt = myconnection.createStatement();
            String query = "CREATE TABLE messages(" +
                    "msender VARCHAR(50) NOT NULL," +
                    "mreciever   VARCHAR(50) NOT NULL," +
                    "mtitle    VARCHAR(50) NOT NULL," +
                    "mdate     TIMESTAMP   NOT NULL," +
                    "themessage  VARCHAR(500) NOT NULL," +
                    "availability  integer  NOT NULL," +
                    "mid        SERIAL   PRIMARY KEY)";
            stmt.execute(query);
            stmt.close();
        }catch(Exception e){
            e.printStackTrace();
            System.exit(0);
        }
        System.out.println("messages table created successfully...");
    }
    public void disconnect(){
        try {
            myconnection.close();
        }catch(Exception e){
            e.printStackTrace();
            System.err.println(e.getClass().getName()+": "+e.getMessage());
            System.exit(0);
        }
    }
    public boolean checkUsernameExist(String usrname){
        String query = "SELECT * FROM users S WHERE S.username = "+ "\'"+ usrname + "\'";
        String query2 = "SELECT * FROM admins S WHERE S.username = " + "\'"+ usrname + "\'";
        try{
            Statement stmt = myconnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            if(rs.isBeforeFirst()){
                stmt.close();
                rs.close();
                return true;
            }
            stmt.close();
            rs.close();

            Statement stmt2 = myconnection.createStatement();
            ResultSet rs2 = stmt2.executeQuery(query2);
            if(rs2.isBeforeFirst()){
                stmt2.close();
                rs2.close();
                return true;
            }
            stmt2.close();
            rs2.close();

            return false;
        }catch (SQLException e){
            e.printStackTrace();
        }
        return false;
    }
    public boolean checkAuthentication( User user) {
        String query = "SELECT * FROM users S WHERE S.username = " + "\'" + user.getUsername() + "\'";
        String query2 = "SELECT * FROM admins S WHERE S.username = " + "\'" + user.getUsername() + "\'";
        try {
            // try in admin table
            Statement stmt2 = myconnection.createStatement();
            ResultSet rs2 = stmt2.executeQuery(query2);
            if (rs2.next() && (rs2.getString("password").equals(user.getPassword())) ) {
                rs2.close();
                stmt2.close();
                return true;
            }
            // try in user table
            Statement stmt = myconnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            if (rs.next() && (rs.getString("password").equals(user.getPassword())) ) {
                rs.close();
                stmt.close();
                return true;
            }
        }catch (SQLException e){
            e.printStackTrace();
        }
        return false;
    }
    public String userTypeChecker(User user){
        String query = "SELECT * FROM admins S WHERE S.username = " + "\'"+ user.getUsername() + "\'";
        try{
            Statement stmt = myconnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            if(rs.next()){return "admin";}
        }catch (SQLException e){
            e.printStackTrace();
        }
        String query2 = "SELECT * FROM users S WHERE S.username = " + "\'"+ user.getUsername() + "\'";
        try{
            Statement stmt2 = myconnection.createStatement();
            ResultSet rs2 = stmt2.executeQuery(query2);
            if(rs2.next()){return "user";}
        }catch (SQLException e){
            e.printStackTrace();
        }
        return "no-user";
    }
    public int getADMINprivilege(String username) {
        String query = "SELECT * FROM admins S WHERE S.username = " + "\'" + username + "\'";
        try {
            Statement stmt = myconnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            if (rs.next()) {
                return rs.getInt("adminprivilege");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }
    public User loginUser(String username, String password) {
        User user = null;
        String query = "SELECT * FROM users S WHERE S.username = " + "\'" + username + "\'";
        String query2 = "SELECT * FROM admins S WHERE S.username = " + "\'" + username + "\'";
        try {
            // try in admin table
            Statement stmt2 = myconnection.createStatement();
            ResultSet rs2 = stmt2.executeQuery(query2);
            if (rs2.next() && (rs2.getString("password").equals(password)) ) {
                user = new Admin();
                user.setUsername(rs2.getString("username"));
                user.setPassword(rs2.getString("password"));
                user.setName( rs2.getString("name"));
                user.setSurname(rs2.getString("surName"));
                user.setGender(rs2.getString("gender"));
                user.setMail(rs2.getString("mail"));
                user.setBirthdate(DatatypeFactory.newInstance().newXMLGregorianCalendar(rs2.getString("birthdate").replace(" ","T")));
                // TODO: adminprivilege set etmemişem
                rs2.close();
                stmt2.close();
                return user;
            }

            // try in user table
            Statement stmt = myconnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            if (rs.next() && (rs.getString("password").equals(password)) ) {
                user = new User();
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setName( rs.getString("name"));
                user.setSurname(rs.getString("surName"));
                user.setGender(rs.getString("gender"));
                user.setMail(rs.getString("mail"));
                user.setBirthdate(DatatypeFactory.newInstance().newXMLGregorianCalendar(rs.getString("birthdate").replace(" ","T")));

                rs.close();
                stmt.close();
                return user;
            }

        }catch (SQLException | DatatypeConfigurationException e){
            e.printStackTrace();
        }
        return user;
    }
    public String sendMessage(Message message){
        try{
            String query = "INSERT INTO messages VALUES( \'"
                    + message.getMsender() + "\', \'"
                    + message.getMreciever() + "\', \'"
                    + message.getMtitle() + "\', \'"
                    + message.getMdate() + "\', \'"
                    + message.getTheMessage() + "\',"
                    + " 0 )";   // 0 is availability and set both for default  //\'"+message.getmID() +"\',

            Statement stmt = myconnection.createStatement();
            stmt.execute(query);
            stmt.close();
            return "message is sent";

        }catch (SQLException e){
            e.printStackTrace();
            System.exit(0);
        }
        return "message is NOT sent";
    }
    public String deleteMessage(int mid,String username){ // if availability=0:both can read, if availability=1:reciever can read, if availability=2:sender can read
        String query = "SELECT * FROM messages M WHERE M.mid = " + mid;
        try {
            Statement stmt = myconnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            if(!rs.isBeforeFirst()){
                rs.close();stmt.close();
                return "message is not found";
            }
            if(rs.next()){
                String senderM  = rs.getString("msender");
                String recieverM = rs.getString("mreciever");
                int currentAvailability = rs.getInt("availability");
                if((senderM.equals(username))&&(recieverM.equals(username))){
                    query = "DELETE FROM messages WHERE mid = " + mid;
                    stmt = myconnection.createStatement();
                    stmt.execute(query);
                    rs.close();
                    stmt.close();
                    return "message is deleted";}
                if((!senderM.equals(username))&&(!recieverM.equals(username))){rs.close();stmt.close();return "you are not aloowed to delete this message";}
                if(senderM.equals(username)&&(currentAvailability==1)){rs.close();stmt.close();return "message is already deleted";}
                else if(recieverM.equals(username)&&(currentAvailability==2)){rs.close();stmt.close();return "message is already deleted";}
                else if(senderM.equals(username)&&(currentAvailability==0)){
                    query ="UPDATE messages M SET availability = 1 WHERE M.mid = " + mid;
                    stmt = myconnection.createStatement();
                    stmt.execute(query);
                    rs.close();
                    stmt.close();
                    return "message is deleted";
                }
                else if(recieverM.equals(username)&&(currentAvailability==0)){
                    query ="UPDATE messages M SET availability = 2 WHERE M.mid = " + mid;
                    stmt = myconnection.createStatement();
                    stmt.execute(query);
                    rs.close();
                    stmt.close();
                    return "message is deleted";
                }
                else{
                    query = "DELETE FROM messages WHERE mid = " + mid;
                    stmt = myconnection.createStatement();
                    stmt.execute(query);
                    rs.close();
                    stmt.close();
                    return "message is deleted";
                }
            }
        }catch (SQLException e){
            e.printStackTrace();
            System.exit(0);
        }
        return "message is deleted";
    }
    public String addUser( User user){
        try{
            if(!checkUsernameExist(user.getUsername())){
                String query = "INSERT INTO users VALUES( \'" + user.getUsername() + "\', \'"
                        + user.getPassword() + "\', \'"
                        + user.getName() + "\', \'"
                        + user.getSurname() + "\', \'"
                        + user.getGender() + "\', \'"
                        + user.getMail() + "\', \'"
                        + user.getBirthdate() + "\')";

                Statement stmt = myconnection.createStatement();
                stmt.execute(query);
                stmt.close();
                return "User: "+ user.getUsername() + " is added to the database\n";
            }else{
                return "User already exists \n";
            }
        }catch (SQLException e){
            e.printStackTrace();
        }
        return "Error";
    }
    public String removeUser(String username){
        try{
            if(checkUsernameExist(username)){
                String query = "DELETE FROM users WHERE username = " + "\'" + username + "\'";
                Statement stmt = myconnection.createStatement();
                stmt.execute(query);
                stmt.close();
                ArrayList<Message> in = getInbox(username);
                ArrayList<Message> out = getOutbox(username);
                for(Message m: in){
                    deleteMessage(m.getMid(),username);
                }
                for(Message m2: out){
                    deleteMessage(m2.getMid(),username);
                }
                return "User: "+ username + " and his/her messages are removed\n";
            }else{
                return "User is not found\n";
            }
        }catch (SQLException e){
            e.printStackTrace();
        }
        return "Error";
    }
    public String updateUser(String username, User user){
        try{
            if(checkUsernameExist(username) ){
                if(checkUsernameExist(user.getUsername())&&(!(username.equals(user.getUsername())))){
                    return "New username already exists please choose another one";
                }
                String query="";
                Statement stmt = myconnection.createStatement();
                if(!username.equals(user.getUsername())){
                    ArrayList<Message> in = getInbox(username);
                    ArrayList<Message> out = getOutbox(username);
                    for(Message m: in){
                        query ="UPDATE messages M SET mreciever = \'" + user.getUsername() +"\' WHERE M.mid = " + m.getMid();
                        stmt.execute(query);
                    }
                    for(Message m2: out){
                        query ="UPDATE messages M SET msender = \'" + user.getUsername() +"\' WHERE M.mid = " + m2.getMid();
                        stmt.execute(query);
                    }
                }
                query = "UPDATE users S SET username = \'" + user.getUsername() + "\', " +
                        "password = \'" + user.getPassword() + "\', " +
                        "name = \'" + user.getName() + "\', " +
                        "\"surname\" = \'" + user.getSurname() + "\', " +
                        "gender = \'" + user.getGender() + "\', " +
                        "mail = \'" + user.getMail() + "\', " +
                        "\"birthdate\" = \'" + user.getBirthdate() + "\' " +
                        "WHERE S.username = \'" + username + "\'";
                stmt.execute(query);
                stmt.close();
                return "User is updated\n";
            }else{
                return "User is not found\n";
            }
        }catch (SQLException e){
            e.printStackTrace();
        }
        return "Error";
    }
    public ArrayList<Admin> getAdmins(){
        ArrayList<Admin> admins = new ArrayList<Admin>();
        String query = "SELECT * FROM admins";
        try {
            Statement stmt = myconnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            while (rs.next()) {
                Admin admin = new Admin();
                admin.setUsername(rs.getString("username"));
                admin.setPassword(rs.getString("password"));
                admin.setName( rs.getString("name"));
                admin.setSurname(rs.getString("surName"));
                admin.setGender(rs.getString("gender"));
                admin.setMail(rs.getString("mail"));
                admin.setBirthdate(DatatypeFactory.newInstance().newXMLGregorianCalendar(rs.getString("birthdate").replace(" ","T")));
                admins.add(admin);
            }
            rs.close();
            stmt.close();
        }catch (SQLException | DatatypeConfigurationException e){
            e.printStackTrace();
        }
        return admins;
    }
    public ArrayList<User> getUsers(){
        ArrayList<User> users = new ArrayList<User>();
        String query = "SELECT * FROM users";
        try {
            Statement stmt = myconnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            while (rs.next()) {
                User user = new User();
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setName( rs.getString("name"));
                user.setSurname(rs.getString("surname"));//TODO: CHANGE İN HERE N TO n
                user.setGender(rs.getString("gender"));
                user.setMail(rs.getString("mail"));
                user.setBirthdate(DatatypeFactory.newInstance().newXMLGregorianCalendar(rs.getString("birthdate")));
                users.add(user);
            }
            rs.close();
            stmt.close();
        }catch (SQLException | DatatypeConfigurationException e){
            e.printStackTrace();
        }
        return users;
    }
    public ArrayList<Message> getInbox(String username){
        ArrayList<Message> inboxMessages = new ArrayList<Message>();
        String query = "SELECT * FROM messages M WHERE M.mreciever = "+ "\'" + username+ "\'";
        try {
            Statement stmt = myconnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            while(rs.next()){
                if(rs.getInt("availability")==2){
                    continue;
                }
                // TODO: column labellar doru mu bak
                Message eachMessage = new Message();
                eachMessage.setMid(rs.getInt("mID"));
                eachMessage.setMsender(rs.getString("Msender"));
                eachMessage.setMreciever(rs.getString("Mreciever"));
                eachMessage.setMtitle(rs.getString("Mtitle"));
                eachMessage.setMdate(DatatypeFactory.newInstance().newXMLGregorianCalendar(rs.getString("Mdate").replace(" ","T")));
                eachMessage.setTheMessage(rs.getString("TheMessage"));
                inboxMessages.add(eachMessage);
            }
            rs.close();
            stmt.close();
        }catch (SQLException | DatatypeConfigurationException e){
            e.printStackTrace();
        }
        return inboxMessages;
    }
    public ArrayList<Message> getOutbox(String username){
        ArrayList<Message> outboxMessages = new ArrayList<Message>();
        String query = "SELECT * FROM messages M WHERE M.msender = " + "\'"+ username+ "\'";
        try {
            Statement stmt = myconnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            while(rs.next()){
                if(rs.getInt("availability")==1){
                    continue;
                }
                Message eachMessage = new Message();
                eachMessage.setMid(rs.getInt("mID"));
                eachMessage.setMsender(rs.getString("Msender"));
                eachMessage.setMreciever(rs.getString("Mreciever"));
                eachMessage.setMtitle(rs.getString("Mtitle"));
                eachMessage.setMdate(DatatypeFactory.newInstance().newXMLGregorianCalendar(rs.getString("Mdate").replace(" ","T")));
                eachMessage.setTheMessage(rs.getString("TheMessage"));
                outboxMessages.add(eachMessage);
            }
            rs.close();
            stmt.close();
        }catch (SQLException | DatatypeConfigurationException e){
            e.printStackTrace();
        }
        return outboxMessages;
    }
    public String addAdmin( Admin admin){
        try{
            if(((admin.getAdminPrivilege())<1)&&(!admin.getUsername().equals("xkraltr"))){return "no such priviledge can be set to new admin";}
            if(!checkUsernameExist(admin.getUsername())){
                String query = "INSERT INTO admins VALUES( \'" + admin.getUsername() + "\', \'"
                        + admin.getPassword() + "\', \'"
                        + admin.getName() + "\', \'"
                        + admin.getSurname() + "\', \'"
                        + admin.getGender() + "\', \'"
                        + admin.getMail() + "\', \'"
                        + admin.getBirthdate() + "\', "
                        + admin.getAdminPrivilege() + ")";
                Statement stmt = myconnection.createStatement();
                stmt.execute(query);
                stmt.close();
                return "Admin: "+ admin.getUsername() +"is added to the database\n";
            }else{
                return "username already exists \n";
            }
        }catch (SQLException e){
            e.printStackTrace();
        }
        return "Error";
    }
    public String removeAdmin( String username){
        try{
            if(checkUsernameExist(username)){
                String query = "DELETE FROM admins WHERE username = " + "\'" + username + "\'";
                Statement stmt = myconnection.createStatement();
                stmt.execute(query);
                stmt.close();
                ArrayList<Message> in = getInbox(username);
                ArrayList<Message> out = getOutbox(username);
                for(Message m: in){
                    deleteMessage(m.getMid(),username);
                }
                for(Message m2: out){
                    deleteMessage(m2.getMid(),username);
                }
                return "Admin and his/her messages are removed\n";
            }else{
                return "Admin is not found\n";
            }
        }catch (SQLException e){
            e.printStackTrace();
        }
        return "Error";
    }
    public String updateAdmin( String username, Admin admin){
        try{
            if(checkUsernameExist(username) ){
                if(((admin.getAdminPrivilege())<1)){return "no such priviledge can be set to new admin";}
                if(checkUsernameExist(admin.getUsername())&&(!(username.equals(admin.getUsername())))){
                    return "New username already exists please choose another one";
                }
                String query="";
                Statement stmt = myconnection.createStatement();
                if(!username.equals(admin.getUsername())){
                    ArrayList<Message> in = getInbox(username);
                    ArrayList<Message> out = getOutbox(username);
                    for(Message m: in){
                        query ="UPDATE messages M SET mreciever = \'" + admin.getUsername() +"\' WHERE M.mid = " + m.getMid();
                        stmt.execute(query);
                    }
                    for(Message m2: out){
                        query ="UPDATE messages M SET msender = \'" + admin.getUsername() +"\' WHERE M.mid = " + m2.getMid();
                        stmt.execute(query);
                    }
                }
                query = "UPDATE admins S SET username = \'" + admin.getUsername() + "\', " +
                        "password = \'" + admin.getPassword() + "\', " +
                        "name = \'" + admin.getName() + "\', " +
                        "\"surname\" = \'" + admin.getSurname() + "\', " +
                        "gender = \'" + admin.getGender() + "\', " +
                        "mail = \'" + admin.getMail() + "\', " +
                        "\"birthdate\" = \'" + admin.getBirthdate() + "\', " +
                        "adminprivilege = " + admin.getAdminPrivilege() +
                        "WHERE S.username = \'" + username + "\'";
                stmt.execute(query);
                stmt.close();
                return "Admin is updated\n";
            }else{
                return "Admin is not found\n";
            }
        }catch (SQLException e){
            e.printStackTrace();
        }
        return "Error";
    }
}