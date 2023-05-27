public class Message{
    int mID,availability;
    String Msender , Mreciever , Mtitle , Mdate , theMessage;

    // CONSTRUCTER
    public Message(){
        this.mID=-1;
        this.availability=-1;
        this.Msender = "";
        this.Mreciever = "";
        this.Mtitle = "";
        this.Mdate = "";
        this.theMessage = "";
    }
    public Message(String Msender, String Mreciever, String Mtitle, String Mdate,  String theMessage ){
        this.Msender = Msender;
        this.Mreciever = Mreciever;
        this.Mtitle = Mtitle;
        this.Mdate = Mdate;
        this.theMessage = theMessage;
    }

    // GETTERS AND SETTERS
    public int getmID() {
        return mID;
    }
    public void setmID(int mID) {
        this.mID = mID;
    }
    public String getMsender() {
        return Msender;
    }
    public void setMsender(String msender) {
        Msender = msender;
    }
    public String getMreciever() {
        return Mreciever;
    }
    public void setMreciever(String mreciever) {
        Mreciever = mreciever;
    }
    public String getMtitle() {
        return Mtitle;
    }
    public void setMtitle(String mtitle) {
        Mtitle = mtitle;
    }
    public String getMdate() {
        return Mdate;
    }
    public void setMdate(String mdate) {
        Mdate = mdate;
    }
    public String getTheMessage() {
        return theMessage;
    }
    public void setTheMessage(String theMessage) {
        this.theMessage = theMessage;
    }

}