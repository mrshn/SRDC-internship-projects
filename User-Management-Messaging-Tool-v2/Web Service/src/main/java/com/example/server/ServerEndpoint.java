package com.example.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import io.spring.guides.gs_producing_web_service.*;

@Endpoint
public class ServerEndpoint {
    private static final String NAMESPACE_URI = "http://spring.io/guides/gs-producing-web-service";

    private DataBase db;

    @Autowired
    public ServerEndpoint(DataBase db) {
        this.db = db;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "loginRequest")
    @ResponsePayload
    public LoginResponse loginRequest(@RequestPayload LoginRequest request) { //TODO: burada admin ve user loginlerini ayrıştırabilirim
        LoginResponse response = new LoginResponse();
        db.connect();
        User user = db.loginUser(request.getUsername(), request.getPassword());
        db.disconnect();
        if (user == null){
            response.setError("Username or password is invalid");
        }else{
            response.setUser(user);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "addUserRequest")
    @ResponsePayload
    public AddUserResponse addUserRequest(@RequestPayload AddUserRequest request) {
        AddUserResponse response = new AddUserResponse();
        User curAdminn = request.getCurAdmin();
        User newUserr = request.getNewUser();
        db.connect();
        String serverMessage;
        if((curAdminn != null) && db.checkAuthentication(curAdminn)){
            if(db.userTypeChecker(curAdminn).equals("admin") ){
                serverMessage = db.addUser(newUserr) ;
            }else{
                serverMessage = "You are not allowed to do this\n";
            }
        }else{
            serverMessage = "Please login first\n";
        }
        response.setResponse(serverMessage);

        db.disconnect();
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "removeUserRequest")
    @ResponsePayload
    public RemoveUserResponse removeUserRequest(@RequestPayload RemoveUserRequest request) {
        RemoveUserResponse response = new RemoveUserResponse();
        User curAdmin = request.getCurAdmin();
        User removedUser = request.getRemovedUser();
        db.connect();
        String serverMessage;
        if((curAdmin != null) && db.checkAuthentication(curAdmin)){
            if(db.userTypeChecker(curAdmin).equals("admin") ){
                serverMessage = db.removeUser(removedUser.getUsername());
            }else{
                serverMessage = "You are not allowed to do this\n";
            }
        }else{
            serverMessage = "Please login first\n";
        }
        response.setResponse(serverMessage);
        db.disconnect();
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "updateUserRequest")
    @ResponsePayload
    public UpdateUserResponse updateUserRequest(@RequestPayload UpdateUserRequest request) {
        UpdateUserResponse response = new UpdateUserResponse();
        User curAdmin = request.getCurAdmin();
        User oldUser = request.getOldUser();
        User newUser = request.getNewUser();
        db.connect();

        String serverMessage;
        if((curAdmin != null) && db.checkAuthentication(curAdmin)){
            if(db.userTypeChecker(curAdmin).equals("admin") ){
                serverMessage = db.updateUser(oldUser.getUsername(), newUser) ;
            }else{
                serverMessage = "You are not allowed to do this\n";       // burada adminlere ulaş diyip sorulur adminler listelenir
            }
        }else{
            serverMessage = "Please login first\n";
        }
        response.setResponse(serverMessage);

        db.disconnect();
        return response;
    }

    // TODO:: FROM HERE LOOK AGAIN

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getUsersRequest")
    @ResponsePayload
    public GetUsersResponse getUsersRequest(@RequestPayload GetUsersRequest request) {
        GetUsersResponse response = new GetUsersResponse();
        User curAdmin = request.getCurAdmin();
        db.connect();
        if((curAdmin != null) && db.checkAuthentication(curAdmin)){
            if(db.userTypeChecker(curAdmin).equals("admin")){
                response.getUser().addAll(db.getAdmins());
                response.getUser().addAll(db.getUsers());
            }else{
                response.setError("You are not an admin");
            }
        }else{
            response.setError("Please login first");
        }
        db.disconnect();
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getInboxRequest")
    @ResponsePayload
    public GetInboxResponse getInboxRequest(@RequestPayload GetInboxRequest request) {
        GetInboxResponse response = new GetInboxResponse();
        User curUser = request.getCurUser();
        db.connect();
        if((curUser != null) && db.checkAuthentication(curUser) ){
            response.getMessage().addAll(db.getInbox(curUser.getUsername()));
        }else{
            response.setError("Please login first");
        }
        db.disconnect();
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getOutboxRequest")
    @ResponsePayload
    public GetOutboxResponse getOutboxRequest(@RequestPayload GetOutboxRequest request) {
        GetOutboxResponse response = new GetOutboxResponse();
        User curUser = request.getCurUser();
        db.connect();
        if((curUser != null) && db.checkAuthentication(curUser) ){
            response.getMessage().addAll(db.getOutbox(curUser.getUsername()));
        }else{
            response.setError("Please login first");
        }
        db.disconnect();
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "sendMessageRequest")
    @ResponsePayload
    public SendMessageResponse sendMessageRequest(@RequestPayload SendMessageRequest request) {
        SendMessageResponse response = new SendMessageResponse();
        User curUser = request.getCurUser();
        Message message = request.getMessage();

        db.connect();
        if((curUser != null) && db.checkAuthentication(curUser)){
            if(db.checkUsernameExist(message.getMreciever())){
                response.setResponse(db.sendMessage(message));
            }else{
                response.setResponse("The User does not exist");
            }
        }else{
            response.setResponse("Please login first");
        }

        db.disconnect();
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "deleteMessageRequest")
    @ResponsePayload
    public DeleteMessageResponse deleteMessageRequest(@RequestPayload DeleteMessageRequest request) {
        DeleteMessageResponse response = new DeleteMessageResponse();
        User curUser = request.getCurUser();
        Message message = request.getMessage();
        db.connect();
        if((curUser != null) && db.checkAuthentication(curUser)){
            response.setResponse(db.deleteMessage(message.getMid(), curUser.getUsername()));
        }else{
            response.setResponse("Please login first");
        }
        db.disconnect();
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "addAdminRequest")
    @ResponsePayload
    public AddAdminResponse addAdminRequest(@RequestPayload AddAdminRequest request) {
        AddAdminResponse response = new AddAdminResponse();
        User curAdminn = request.getCurAdmin();
        Admin newAdmin = request.getNewAdmin();
        db.connect();
        String serverMessage;
        if((curAdminn != null) && db.checkAuthentication(curAdminn)){
            if(db.userTypeChecker(curAdminn).equals("admin") ){
                if(newAdmin.getAdminPrivilege() <= db.getADMINprivilege(curAdminn.getUsername())){
                    serverMessage = "You are not allowed to add an higher or same level admin\n";
                }else{
                    serverMessage = db.addAdmin(newAdmin) ;
                }
            }else{
                serverMessage = "You are not allowed to do this\n";
            }
        }else{
            serverMessage = "Please login first\n";
        }
        response.setResponse(serverMessage);
        db.disconnect();
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "removeAdminRequest")
    @ResponsePayload
    public RemoveAdminResponse removeAdminRequest(@RequestPayload RemoveAdminRequest request) {
        RemoveAdminResponse response = new RemoveAdminResponse();
        User curAdmin = request.getCurAdmin();
        Admin removedAdmin = request.getRemovedAdmin();
        db.connect();
        String serverMessage;
        if((curAdmin != null) && db.checkAuthentication(curAdmin)){
            if(db.userTypeChecker(curAdmin).equals("admin") ){
                if(!db.checkUsernameExist(removedAdmin.getUsername())){
                    serverMessage = "Admin is not found\n";
                }else if(db.getADMINprivilege(removedAdmin.getUsername()) <= db.getADMINprivilege(curAdmin.getUsername())){
                    serverMessage = "You are not allowed to remove an higher or same level admin\n";
                }else{
                    serverMessage = db.removeAdmin(removedAdmin.getUsername());
                }
            }else{
                serverMessage = "You are not allowed to do this\n";
            }
        }else{
            serverMessage = "Please login first\n";
        }

        response.setResponse(serverMessage);
        db.disconnect();
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "updateAdminRequest")
    @ResponsePayload
    public UpdateAdminResponse updateAdminRequest(@RequestPayload UpdateAdminRequest request) {
        UpdateAdminResponse response = new UpdateAdminResponse();
        User curAdmin = request.getCurAdmin();
        Admin oldAdmin = request.getOldAdmin();
        Admin newAdmin = request.getNewAdmin();
        db.connect();

        String serverMessage;
        if((curAdmin != null) && db.checkAuthentication(curAdmin)){
            if(db.userTypeChecker(curAdmin).equals("admin") ){
                if(!db.checkUsernameExist(oldAdmin.getUsername())){
                    serverMessage = "Admin is not found\n";
                }else if(db.getADMINprivilege(oldAdmin.getUsername()) <= db.getADMINprivilege(curAdmin.getUsername())){
                    serverMessage = "You are not allowed to remove an higher or same level admin\n";
                }else if(newAdmin.getAdminPrivilege() <= db.getADMINprivilege(curAdmin.getUsername())){
                    serverMessage = "You are not allowed to update an admin to higher level than you or same level with you\n";
                }
                else{
                    serverMessage = db.updateAdmin(oldAdmin.getUsername(), newAdmin) ;
                }

            }else{
                serverMessage = "You are not allowed to do this\n";       // burada adminlere ulaş diyip sorulur adminler listelenir
            }
        }else{
            serverMessage = "Please login first\n";
        }

        response.setResponse(serverMessage);

        db.disconnect();
        return response;
    }
}
