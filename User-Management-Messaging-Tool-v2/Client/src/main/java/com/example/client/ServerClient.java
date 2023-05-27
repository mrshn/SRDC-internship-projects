package com.example.client;

import com.example.client.wsdl.User;
import com.example.client.wsdl.Message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;

import com.example.client.wsdl.AddUserResponse;
import com.example.client.wsdl.AddUserRequest;

import com.example.client.wsdl.SendMessageResponse;
import com.example.client.wsdl.SendMessageRequest;

import com.example.client.wsdl.GetUsersResponse;
import com.example.client.wsdl.GetUsersRequest;

import com.example.client.wsdl.GetInboxResponse;
import com.example.client.wsdl.GetInboxRequest;

import com.example.client.wsdl.GetOutboxResponse;
import com.example.client.wsdl.GetOutboxRequest;

public class ServerClient extends WebServiceGatewaySupport {

    private static final Logger log = LoggerFactory.getLogger(ServerClient.class);

    public AddUserResponse addUser(User curClientAdmin, User newClientUser) {
        AddUserRequest request = new AddUserRequest();
        request.setCurAdmin(curClientAdmin);
        request.setNewUser(newClientUser);

        AddUserResponse response = (AddUserResponse) getWebServiceTemplate()
                .marshalSendAndReceive("http://localhost:8080/ws/server", request,
                        new SoapActionCallback(
                                "http://spring.io/guides/gs-producing-web-service/GetCountryRequest"));
        return response;
    }


    public SendMessageResponse sendMessage(User user, Message message) {
        SendMessageRequest request = new SendMessageRequest();
        request.setMessage(message);
        request.setCurUser(user);
        log.info("message is sent from :" + user.getUsername() + ", to " + message.getMreciever());

        SendMessageResponse response = (SendMessageResponse) getWebServiceTemplate()
                .marshalSendAndReceive("http://localhost:8080/ws/server", request,
                        new SoapActionCallback(
                                "http://spring.io/guides/gs-producing-web-service/GetCountryRequest"));
        return response;
    }

    public GetUsersResponse getUsers(User user) {

        GetUsersRequest request = new GetUsersRequest();
        request.setCurAdmin(user);
        log.info("Admin " + user.getUsername() + " requested the users list");

        GetUsersResponse response = (GetUsersResponse) getWebServiceTemplate()
                .marshalSendAndReceive("http://localhost:8080/ws/server", request,
                        new SoapActionCallback(
                                "http://spring.io/guides/gs-producing-web-service/GetCountryRequest"));

        return response;
    }

    public GetInboxResponse getInbox(User user) {

        GetInboxRequest request = new GetInboxRequest();
        request.setCurUser(user);
        log.info("Request inbox from " + user.getUsername());

        GetInboxResponse response = (GetInboxResponse) getWebServiceTemplate()
                .marshalSendAndReceive("http://localhost:8080/ws/server", request,
                        new SoapActionCallback(
                                "http://spring.io/guides/gs-producing-web-service/GetCountryRequest"));

        return response;
    }

    public GetOutboxResponse getOutbox(User user) {

        GetOutboxRequest request = new GetOutboxRequest();
        request.setCurUser(user);
        log.info("Request outbux from " + user.getUsername());

        GetOutboxResponse response = (GetOutboxResponse) getWebServiceTemplate()
                .marshalSendAndReceive("http://localhost:8080/ws/server", request,
                        new SoapActionCallback(
                                "http://spring.io/guides/gs-producing-web-service/GetCountryRequest"));

        return response;
    }



}
