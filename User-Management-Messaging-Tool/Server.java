import java.net.*;
import java.io.*;
public class Server{
    public static void main(String[] args) throws Exception {
        try{
            ServerSocket server=new ServerSocket(5858);
            int counter=0;
            System.out.println("Server Started ....");
            while(true){
                counter++;
                Socket serverClient=server.accept();  //server accept the client connection request
                System.out.println(" >> " + "Client No:" + counter + " started!");
                ServerClientThread sct = new ServerClientThread(serverClient,counter); //send  the request to a separate thread
                sct.start();
            }
        }catch(Exception e){
            System.out.println(e);
        }
    }
}



class ServerClientThread extends Thread {
    Socket serverClient;
    int clientNo;
    User user;
    ServerClientThread(Socket inSocket,int counter){
        serverClient = inSocket;
        clientNo=counter;
        user = null;
    }

    public void run(){
        try{
            DataInputStream inStream = new DataInputStream(serverClient.getInputStream());
            DataOutputStream outStream = new DataOutputStream(serverClient.getOutputStream());
            String clientMessage="", serverResponse="";
            DataBase db = new DataBase();
            db.connect();
            Request req = new Request(db);
            while(!clientMessage.equals("exit")){
                clientMessage = inStream.readUTF();
                System.out.println("->clientMessage: "+clientMessage);
                if(clientMessage=="exit"){
                    outStream.writeUTF("EXIT DONE");
                    outStream.flush();
                    break;
                }
                serverResponse = req.handleRequest(clientMessage);
                outStream.writeUTF(serverResponse);
                System.out.println("->serverResponse:\n"+serverResponse);
                outStream.flush();
            }
            db.disconnect();
            inStream.close();
            outStream.close();
            serverClient.close();
        }catch(Exception ex){
            System.out.println(ex);
        }finally{
            System.out.println("Client -" + clientNo + " exit!! ");
        }
    }
}




