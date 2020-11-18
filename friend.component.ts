import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap'


export class Friend {
  constructor(
    public EmpID: string,
    public Name: string,
    public EmpCode: string,
    public Salary: string,
    public Contact: string,
    public Email: string
  ){
  }
}

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {
  
  closeResult: string;
  friends : Friend[];
  friend: Friend;
  Name : any;
  editForm: FormGroup;
  deleteID: any;
  

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
    
  ) { }

  ngOnInit(): void {
    this.getFriends();

    this.editForm = this.fb.group({
      EmpID: [''],
      Name: [''],
      EmpCode: [''],
      Salary: [''],
      Contact: [''],
      Email: ['']
    });
  }

  getFriends(){
    this.httpClient.get<any>('http://localhost:3000/employees').subscribe(
      response => {
        console.log(response);
        this.friends = response;
      }
    );
  }

  open(content) {
    this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  

  //Insert start
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(f: NgForm) {
    const url = 'http://localhost:3000/employees';
    this.httpClient.post(url, f.value)
      .subscribe(
        (result) => {
        this.ngOnInit(); //reload the table
      }
      );
    this.modalService.dismissAll(); //dismiss the modal
  }

  //Details start
  openDetails(targetModal, Friends: Friend) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
   });
    document.getElementById('EmpID').setAttribute('value',Friends.EmpID);
    document.getElementById('Name').setAttribute('value', Friends.Name);
    document.getElementById('EmpCode').setAttribute('value', Friends.EmpCode);
    document.getElementById('Salary').setAttribute('value', Friends.Salary);  
    document.getElementById('Contact').setAttribute('value', Friends.Contact);
    document.getElementById('Email').setAttribute('value', Friends.Email);  
 }

 //details-end


//Edit start

openEdit(targetModal, friend: Friend) {
  this.modalService.open(targetModal, {
   backdrop: 'static',
   size: 'lg'
 });
  this.editForm.patchValue({
    EmpID: friend.EmpID,
    Name: friend.Name,
    EmpCode: friend.EmpCode,
    Salary: friend.Salary,
    Contact: friend.Contact,
    Email: friend.Email
  });
  
}
    onSave(){
      const editUrl = 'http://localhost:3000/employees';
      console.log(this.editForm.value);
      this.httpClient.put ( editUrl, this.editForm.value,{ withCredentials: false })
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
      
    }

//delete start
    openDelete(targetModal, friend: Friend) {
      this.deleteID = friend.EmpID;
      this.modalService.open(targetModal, {
        backdrop: 'static',
        size: 'lg'
      });
    }    

    onDelete() {
      const deleteURL = 'http://localhost:3000/employees/' + this.deleteID;
      //console.log(deleteURL);
      this.httpClient.delete(deleteURL)
        .subscribe((results) => {
          this.ngOnInit();
          this.modalService.dismissAll();
        });
    }
  }

