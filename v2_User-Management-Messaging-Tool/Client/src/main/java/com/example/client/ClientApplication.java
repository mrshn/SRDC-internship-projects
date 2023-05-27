package com.example.client;

import com.example.client.wsdl.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.xml.datatype.DatatypeFactory;
import java.io.BufferedReader;
import java.io.InputStreamReader;


@SpringBootApplication
public class ClientApplication{

    public static void main(String[] args){
        SpringApplication.run(ClientApplication.class, args);
    }

    @Bean
    CommandLineRunner lookup(ServerClient clientOfServerApp) {
        return args -> {
            User clientUser = new User();
            clientUser.setUsername("xkraltr");
            clientUser.setPassword("123");
            clientUser.setName("firstAdmin");
            clientUser.setSurname("MAINADMIN");
            clientUser.setGender("MALE");
            clientUser.setMail("xkraltr@srdc.com");
            clientUser.setBirthdate(DatatypeFactory.newInstance().newXMLGregorianCalendar("2000-05-22"));
            System.out.println("WELCOME XKRALTR");

            Message message = new Message();

            System.out.println("Select and type your request from :-ADDUSER-SENDMESSAGE-LISTUSERS-INBOX-OUTBOX-EXIT");
            BufferedReader bufferRead = new BufferedReader(new InputStreamReader(System.in));
            String requestFromClient = bufferRead.readLine();

            while(!requestFromClient.equals("EXIT")) {
                if(requestFromClient.equals("ADDUSER")) {
                    User newUSER = new User();
                    newUSER.setUsername("newuser");
                    newUSER.setPassword("123");
                    newUSER.setName("newUser");
                    newUSER.setSurname("clientuser");
                    newUSER.setGender("MALE");
                    newUSER.setMail("new@srdc.com");
                    newUSER.setBirthdate(DatatypeFactory.newInstance().newXMLGregorianCalendar("2000-02-22"));
                    AddUserResponse response = clientOfServerApp.addUser(clientUser, newUSER);
                    System.out.println("Response to ADDUSER : " + response.getResponse());
                }else if (requestFromClient.equals("SENDMESSAGE")) {
                    message.setMsender("xkraltr");
                    message.setMreciever("xkraltr");
                    message.setMtitle("xkraltr client message");
                    message.setMdate(DatatypeFactory.newInstance().newXMLGregorianCalendar("2021-08-11"));
                    message.setTheMessage("this message is sent by Client Server");
                    SendMessageResponse response = clientOfServerApp.sendMessage(clientUser, message);
                    System.out.println("Response to SENDMESSAGE : " + response.getResponse());
                }else if (requestFromClient.equals("LISTUSERS")) {
                    GetUsersResponse response = clientOfServerApp.getUsers(clientUser);
                    for (User u : response.getUser()) {
                        System.out.println("Username: " + u.getUsername() + " Name: " + u.getName() +
                                " Surname: " + u.getSurname() + " Birthdate: " + u.getBirthdate() + " Mail: " +
                                u.getMail() + " Gender: " + u.getGender());
                    }
                }else if (requestFromClient.equals("INBOX")) {
                    GetInboxResponse responseInbox = clientOfServerApp.getInbox(clientUser);
                    for (Message eachMessage : responseInbox.getMessage()) {
                        System.out.println("Msender: " + eachMessage.getMsender()  + " Mtitle: " + eachMessage.getMtitle() + " theMessage: " + eachMessage.getTheMessage() + " Mdate: " + eachMessage.getMdate());
                    }
                }
                else if (requestFromClient.equals("OUTBOX")) {
                    GetOutboxResponse responseInbox = clientOfServerApp.getOutbox(clientUser);
                    for (Message eachMessage : responseInbox.getMessage()) {
                        System.out.println("Mreciever: " + eachMessage.getMreciever()  + " Mtitle: " + eachMessage.getMtitle() + " theMessage: " + eachMessage.getTheMessage() + " Mdate: " + eachMessage.getMdate());
                    }
                }
                requestFromClient = bufferRead.readLine();
            }
            System.out.println("See You");
        };
    }

}
