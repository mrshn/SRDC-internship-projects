import java.util.ArrayList;
import java.util.Collections;

public class Request{
    ArrayList<String> tokens;
    DataBase db;
    User user;
    String serverMessage;

    public Request(DataBase db){
        tokens = new ArrayList<String>();
        this.db = db;
        user = null;
        serverMessage = "";
    }
    public String  handleRequest(String clientMessage){
        tokens.clear();
        Collections.addAll(tokens, clientMessage.split(";;"));
        serverMessage = "";
        makeRequest();
        return serverMessage;
    }
    public void makeRequest(){
        if( (user!=null) && !db.checkAuthentication(user) ){
            user=null;
            serverMessage = "Please login first\n";
        }

        if(tokens.get(0).equals("HELP") && tokens.size() == 1){ helpRequest();}
        else if(tokens.get(0).equals("LOGIN") && tokens.size() == 3){ loginRequest();}
        else if(tokens.get(0).equals("WHOAMI") && tokens.size() == 1){ whoAmIRequest();}
        else if(tokens.get(0).equals("LOGOUT") && tokens.size() == 1){ logoutRequest();}
        else if(tokens.get(0).equals("INBOX") && tokens.size() == 1){ getInboxRequest();}
        else if(tokens.get(0).equals("OUTBOX") && tokens.size() == 1){ getOutboxRequest();}
        else if(tokens.get(0).equals("msgSEND") && tokens.size() == 4){ sendMessageRequest();}
        else if(tokens.get(0).equals("msgDELETE") && tokens.size() == 2){ deleteMessageRequest();}
        else if(tokens.get(0).equals("ADDUSER") && tokens.size() == 8){ addUserRequest();}
        else if(tokens.get(0).equals("REMOVEUSER") && tokens.size() == 2){ removeUserRequest();}
        else if(tokens.get(0).equals("UPDATEUSER")  && tokens.size() == 9){ updateUserRequest();}
        else if(tokens.get(0).equals("LISTUSERS")  && tokens.size() == 1){ showListUsersRequest();}
        else if(tokens.get(0).equals("ADDADMIN") && tokens.size() == 9){ addAdminRequest();}
        else if(tokens.get(0).equals("REMOVEADMIN") && tokens.size() == 2){ removeAdminRequest();}
        else if(tokens.get(0).equals("UPDATEADMIN")  && tokens.size() == 10){ updateAdminRequest();}
        else if(tokens.get(0).equals("exit") && tokens.size() == 1){ serverMessage = "Exit\n";}
        else{ serverMessage = "Command is invalid2\n";}
    }
    public void helpRequest(){
        if( (user!=null) && db.checkAuthentication(user) ){
            if(db.userTypeChecker(user).equals("admin")){
                serverMessage = "------Valid Commands------\n" +
                        "\tHELP\n" +
                        "\tLOGIN;;username;;password\n" +
                        "\tWHOAMI\n" +
                        "\tLOGOUT\n" +
                        "\tINBOX\n" +
                        "\tOUTBOX\n" +
                        "\tmsgSEND;;Mreciever;;Mtitle;;theMessage\n" +
                        "\tmsgDELETE;;messageId\n" +
                        "\texit\n"+
                        "\tADDUSER;;username;;password;;name;;surName;;gender;;mail;;birthDate\n" +
                        "\tUPDATEUSER;;username;;newUsername;;newPassword;;newName;;newSurName;;newGender;;newMail;;newBirthdate\n" +
                        "\tREMOVEUSER;;removedUsername\n" +
                        "\tADDADMIN;;ADMINusername;;password;;name;;surName;;gender;;mail;;birthDate;;AdminPrivilege\n" +
                        "\tUPDATEADMIN;;username;;newADMINUsername;;newPassword;;newName;;newSurName;;newGender;;newMail;;newBirthdate;;AdminPrivilege\n" +
                        "\tREMOVEADMIN;;removedADMINUsername\n" +
                        "\tLISTUSERS\n";
                return;
            }
            serverMessage = "------Valid Commands------\n" +
                    "\tHELP\n" +
                    "\tLOGIN;;username;;password\n" +
                    "\tWHOAMI\n" +
                    "\tLOGOUT\n" +
                    "\tINBOX\n" +
                    "\tOUTBOX\n" +
                    "\tmsgSEND;;Mreciever;;Mtitle;;theMessage\n" +
                    "\tmsgDELETE;;messageId\n" +
                    "\texit\n";
            return;
        }else{
            user = null;
            serverMessage="PLEASE LOGIN FIRST\n" +
                    "\tLOGIN;;username;;password\n";
            return;
        }
    }
    public void loginRequest(){
        if(user != null){
            serverMessage = "Please logout first\n";
        }else{
            user = db.loginUser(tokens.get(1), tokens.get(2));
            if(user != null){
                String usertype = db.userTypeChecker(user);
                if(usertype.equals("admin")){
                    serverMessage = "ADMIN Login is successful " + "Please type HELP to see commands\n";
                }else if(usertype.equals("user")){
                    serverMessage = "USER Login is successful " + "Please type HELP to see commands\n";
                }
            }else{
                serverMessage = "Invalid password or user\n";
            }
        }
    }
    public void whoAmIRequest(){
        if( (user!=null) && db.checkAuthentication(user) ){
            serverMessage = "CURRENT USERNAME:" +user.getUsername()+ "\n";
        }
        else{
            user = null;
            serverMessage="PLEASE LOG IN FIRST";
        }
    }
    public void logoutRequest(){
        if(user != null){
            user = null;
            serverMessage = "Logout is successful\n";
        }else{
            serverMessage = "Please login first\n";
        }
    }
    public void getInboxRequest(){
        if((user != null) && db.checkAuthentication(user) ){
            ArrayList<Message> inboxMessages = db.getInbox(user.getUsername());
            for(Message m: inboxMessages){
                serverMessage += "Id: " + m.getmID() + ", Msender: " + m.getMsender() + ", Mtitle: " + m.getMtitle() + ", Mdate: " + m.getMdate() + ", TheMessage: \""+ m.getTheMessage()+"\n";
            }
        }else{
            user = null;
            serverMessage = "Please login first\n";
        }
    }
    public void getOutboxRequest(){
        if((user != null) && db.checkAuthentication(user)){
            ArrayList<Message> outboxMessages = db.getOutbox(user.getUsername());
            for(Message m: outboxMessages){
                serverMessage += "Id: " + m.getmID() + ", Mreceiver: " + m.getMreciever() + ", Mtitle: " + m.getMtitle() + ", Mdate: " + m.getMdate() + ", TheMessage: \""+ m.getTheMessage()+"\n";
            }
        } else{
            user = null;
            serverMessage = "Please login first\n";
        }
    }
    public void sendMessageRequest(){
        if((user != null) && db.checkAuthentication(user)){
            if(db.checkUsernameExist(tokens.get(1))){
                Message myMessage = new Message(user.getUsername(),tokens.get(1),tokens.get(2),java.time.LocalDateTime.now().toString(),tokens.get(3));
                serverMessage = db.sendMessage(myMessage);
            }else{
                serverMessage = "The user does not exist\n";
            }
        }else{
            user = null;
            serverMessage = "Please login first\n";
        }
    }
    public void deleteMessageRequest(){
        if((user != null) && db.checkAuthentication(user)){
            serverMessage = db.deleteMessage(Integer.parseInt(tokens.get(1)),user.getUsername());
        }else{
            user = null;
            serverMessage = "Please login first\n";
        }
    }
    public void addUserRequest(){
        if((user != null) && db.checkAuthentication(user)){
            if(db.userTypeChecker(user).equals("admin") ){
                User newUser  = new User(tokens.get(1), tokens.get(2), tokens.get(3), tokens.get(4), tokens.get(5), tokens.get(6), tokens.get(7));
                serverMessage = db.addUser(newUser) ;
            }else{
                serverMessage = "You are not allowed to do this\n";       //TODO: burada adminlere ulaş diyip sorulur adminler listelenir
            }
        }else{
            user = null;
            serverMessage = "Please login first\n";
        }
    }
    public void removeUserRequest(){
        if((user != null) && db.checkAuthentication(user)){
            if(db.userTypeChecker(user).equals("admin") ){
                serverMessage = db.removeUser(tokens.get(1));
            }else{
                serverMessage = "You are not allowed to do this\n";       // burada adminlere ulaş diyip sorulur adminler listelenir
            }
        }else{
            user = null;
            serverMessage = "Please login first\n";
        }
    }
    public void updateUserRequest(){
        if((user != null) && db.checkAuthentication(user)){
            if(db.userTypeChecker(user).equals("admin") ){
                User tempusr  = new User(tokens.get(2),tokens.get(3), tokens.get(4), tokens.get(5), tokens.get(6), tokens.get(7), tokens.get(8));
                serverMessage = db.updateUser(tokens.get(1), tempusr) ;
            }else{
                serverMessage = "You are not allowed to do this\n";       // burada adminlere ulaş diyip sorulur adminler listelenir
            }
        }else{
            user = null;
            serverMessage = "Please login first\n";
        }
    }
    public void showListUsersRequest(){
        if((user != null) && db.checkAuthentication(user)){
            if( db.userTypeChecker(user).equals("admin") ){
                ArrayList<User> users = db.getUsers();
                ArrayList<Admin> admins = db.getAdmins();
                for(Admin eachAdmin: admins){
                    if(eachAdmin.getUsername().equals(user.getUsername())){
                        serverMessage += "--YOU-- \t Username: " + eachAdmin.getUsername() +
                                ", Password: " + "********" +
                                ", Name: " + eachAdmin.getName() +
                                ", SurName: " + eachAdmin.getSurName() +
                                ", Mail: " + eachAdmin.getMail() +
                                ", BirthDate: " + eachAdmin.getBirthDate() +
                                ", Gender: " + eachAdmin.getGender() +
                                ", AdminPrivilege: " + eachAdmin.getAdminPrivilege() +
                                "\n";
                        continue;
                    }
                    if(db.getADMINprivilege(eachAdmin.getUsername())<db.getADMINprivilege(user.getUsername())){
                        serverMessage += "HIGHER ADMIN LEVEL\t Username: " + eachAdmin.getUsername() +
                                ", Password: " + "********" +
                                ", Name: " + eachAdmin.getName() +
                                ", SurName: " + eachAdmin.getSurName() +
                                ", Mail: " + eachAdmin.getMail() +
                                ", BirthDate: " + eachAdmin.getBirthDate() +
                                ", Gender: " + eachAdmin.getGender() +
                                ", AdminPrivilege: " + db.getADMINprivilege(eachAdmin.getUsername()) +
                                "\n";
                    }else if(db.getADMINprivilege(eachAdmin.getUsername())==db.getADMINprivilege(user.getUsername())){
                        serverMessage += "SAME ADMIN LEVEL\t Username: " + eachAdmin.getUsername() +
                                ", Password: " + "********" +
                                ", Name: " + eachAdmin.getName() +
                                ", SurName: " + eachAdmin.getSurName() +
                                ", Mail: " + eachAdmin.getMail() +
                                ", BirthDate: " + eachAdmin.getBirthDate() +
                                ", Gender: " + eachAdmin.getGender() +
                                ", AdminPrivilege: " + db.getADMINprivilege(eachAdmin.getUsername()) +
                                "\n";
                    }else{serverMessage += "LOWER ADMIN LEVEL\t Username: " + eachAdmin.getUsername() +
                            ", Password: " + eachAdmin.getPassword() +
                            ", Name: " + eachAdmin.getName() +
                            ", SurName: " + eachAdmin.getSurName() +
                            ", Mail: " + eachAdmin.getMail() +
                            ", BirthDate: " + eachAdmin.getBirthDate() +
                            ", Gender: " + eachAdmin.getGender() +
                            ", AdminPrivilege: " + db.getADMINprivilege(eachAdmin.getUsername()) +
                            "\n";
                    }
                }
                for(User eachUser: users){
                    serverMessage += "USER TYPE\t Username: " + eachUser.getUsername() +
                            ", Password: " + eachUser.getPassword() +
                            ", Name: " + eachUser.getName() +
                            ", SurName: " + eachUser.getSurName() +
                            ", Mail: " + eachUser.getMail() +
                            ", BirthDate: " + eachUser.getBirthDate() +
                            ", Gender: " + eachUser.getGender() +
                            "\n";
                }
            }else{
                serverMessage = "You are not allowed to do this\n";       // burada adminlere ulaş diyip sorulur adminler listelenir
            }
        }else{
            user = null;
            serverMessage = "Please login first\n";
        }
    }
    public void addAdminRequest(){
        if((user != null) && db.checkAuthentication(user)){
            if(db.userTypeChecker(user).equals("admin") ){
                if(Integer.parseInt(tokens.get(8)) <= db.getADMINprivilege(user.getUsername())){
                    serverMessage = "You are not allowed to add an higher or same level admin\n";
                    return;
                }
                Admin newAdmin  = new Admin(tokens.get(1), tokens.get(2), tokens.get(3), tokens.get(4), tokens.get(5), tokens.get(6), tokens.get(7),Integer.parseInt(tokens.get(8)));
                serverMessage = db.addAdmin(newAdmin) ;
            }else{
                serverMessage = "You are not allowed to do this\n";       //TODO: burada adminlere ulaş diyip sorulur adminler listelenir
            }
        }else{
            user = null;
            serverMessage = "Please login first\n";
        }
    }
    public void removeAdminRequest(){
        if((user != null) && db.checkAuthentication(user)){
            if( db.userTypeChecker(user).equals("admin") ){
                if(db.getADMINprivilege(tokens.get(1)) <= db.getADMINprivilege(user.getUsername())){
                    serverMessage = "You are not allowed to delete an higher or same level admin\n";
                    return;
                }
                serverMessage = db.removeAdmin(tokens.get(1));
            }else{
                serverMessage = "You are not allowed to do this\n";
            }
        }else{
            user = null;
            serverMessage = "Please login first\n";
        }
    }
    public void updateAdminRequest(){
        if((user != null) && db.checkAuthentication(user)){
            if(db.userTypeChecker(user).equals("admin") ){
                if(db.getADMINprivilege(tokens.get(1)) <= db.getADMINprivilege(user.getUsername())){
                    serverMessage = "You are not allowed to update an higher or same level admin\n";
                    return;
                }
                if(Integer.parseInt(tokens.get(9)) <= db.getADMINprivilege(user.getUsername())){
                    serverMessage = "You are not allowed to update an admin to higher level than you or same level with you\n";
                    return;
                }
                Admin tempadmin  = new Admin(tokens.get(2),tokens.get(3), tokens.get(4), tokens.get(5), tokens.get(6), tokens.get(7), tokens.get(8),Integer.parseInt(tokens.get(9)));
                serverMessage = db.updateAdmin(tokens.get(1), tempadmin) ;
            }else{
                serverMessage = "You are not allowed to do this\n";       // burada adminlere ulaş diyip sorulur adminler listelenir
            }
        }else{
            user = null;
            serverMessage = "Please login first\n";
        }
    }
}