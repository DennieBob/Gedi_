const app = Vue.createApp({
    
    // template:`<h1>{{firstName}}</h1>`,
    data() {
        return { 
           optionTitle:'',
           nextRefPlaceholder:'',
            errors:{
              errs:0,
              title:'',
              optionType:'',
              _type:'',
              multiselect:'',
              groupText:'',
              nextRef:'',
              endNote:''
            },
            questionDB: [],
            references: [],
            isEmpty:[1],
            currentLastId:0,
            isInvalid:'  ',
            question: {
              title: "",
              optionType: "",
              id: "",
              type: "",
              multiselect: "",
              parentId: "",
              options: [],
              nextRef: '', 
              groupText: "",
              isEnd: "",
              endNote: "",
            },

      empty_question: {
        title: "",
        optionType: "",
        id: "",
        type: "",
        multiselect: "",
        parentId: "",
        options: [],
        nextRef: '',
        groupText: "",
        isEnd: "",
        endNote: "",
      },
      len: "0",
      optionLength: "1",
      fixedLength: "1",
      indx: "0",
      clicked: true,
      editMode: false,
    };
  },
  // watch: {
  //   // whenever question changes, this function will run
  //   question:function (k){
  //     k.groupText= 'test'
  //     console.log(this.question.groupText) 
  //   }
  // },
  beforeMount(){
    this.getData()
 },
  methods: {
      getData: async function () {
      console.log('fetched')
      const res = await fetch("/questionaire/get").then(
        (response) => {
          return response.json(); 
        }
      );
      let data = await res;
      data = data.replaceAll("'false'",false)
      data = data.replaceAll("'true'",true)

      data = JSON.parse(data);

      if (data[0] !=0){
        this.isEmpty=[1]
        const arr =[] 
        let jsonOptions  
        data.map(el=>{ 
          jsonOptions=JSON.parse(el.fields.options.replaceAll("'",'"')) 
          let k=el.fields.nextRef.replaceAll('"','') 
          let item = {
              title:el.fields.title,
              optionType:el.fields.optionType,
              id:el.fields.theId,
              type:el.fields.theType,
              multiselect:el.fields.multiselect,
              parentId:el.fields.parentId,
              options: jsonOptions, 
              nextRef:el.fields.nextRef,
              groupText:el.fields.groupText,
              isEnd:el.fields.isEnd,
              endNote:el.fields.endNote,
          }
        arr.push(item)
        })  
        arr.sort((a,b)=>a.id-b.id) 
        this.questionDB=arr
        
      }else{
        this.isEmpty=data
      }
    }, 
    upDateDBNow: async function () { 
        const model  = this.questionDB  
        let modelled =[]
        model.map(el=>{ 
            modelled.push({
            "groupText": el.groupText,
            "isEnd": el.isEnd,
            "multiselect": el.multiselect,
            "nextRef": el.nextRef,
            "optionType": el.optionType, 
            "options":  el.options,     
            "parentId": el.parentId,
            "reference": el.parentId,  
            "theId": el.id,
            "theType": el.type,
            "title": el.title,
            "endNote": el.endNote,                
            })
        }) 
        const csrftoken = Cookies.get('csrftoken');
        let payload = JSON.stringify(modelled)
        payload = payload.replaceAll(false,'"false"')
        payload = payload.replaceAll(true,'"true"')
        fetch(`/questionaire/update/`, {
            method: 'POST',  
            headers: {
              'X-CSRFToken': csrftoken,
              "x-Requested-With": "XMLHttpRequest",
              'Content-Type': 'application/json',
            },
            body: payload,
          })
          .then(response => {
              console.log('posted') 
          })
          .then(data => { 
          })
          .catch((error) => {
            console.log('Error:', error);
          });

      }, 
      handleInput(){
        this.errors.errs=0
        const isError = ' form-control is-invalid required'
        const {title,optionType,type:_type,multiselect,groupText,endNote,nextRef} = this.question
  
        if(!title){this.errors.title+=isError;this.errors.errs=1}else{this.errors.title=''}
        if(!optionType){this.errors.optionType+=isError;this.errors.errs=1}else{this.errors.optionType=''}
        if(!_type){this.errors._type+=isError;this.errors.errs=1}else{this.errors._type=''}
        if(this.question.optionType=="Predefined")if(!multiselect){this.errors.multiselect+=isError;this.errors.errs=1}else{this.errors.multiselect=''}
        if(this.question.optionType=="Custom")if(!nextRef){this.errors.nextRef+=isError;this.errors.errs=1}else{this.errors.nextRef=''}
      },
    upDateDB(){ 
      this.handleInput() 
      if(this.errors.errs==0){ 
        if(!this.editMode && this.questionDB.length===0){ 
                this.questionDB = [...this.questionDB,{...this.question,id:this.questionDB.length+1}]
                this.currentLastId+=1
                let obj=0
                this.questionDB[obj].options.length>0&&this.questionDB[obj].options.map((item,index)=>{
                  if(item.next_question!=''){
                    this.questionDB[obj].options[index].id=this.questionDB.length+1
                    this.questionDB.push({...this.empty_question,title:item.next_question,options:[],parentId:obj,id:this.questionDB.length+1})
                  }
                  })
                if(this.question.nextRef !==''){  
                this.questionDB.push({...this.empty_question,title:this.question.nextRef ,options:[],parentId:obj,id:this.questionDB.length+1})
              }

            }else{
              this.questionDB.map((each,index)=>{
                    if(each.id===this.question.id) {
                        let obj
                        this.questionDB.filter((el,index)=>{if(el.id==each.id)obj=index})
                        this.questionDB[obj]= {...this.questionDB[obj],...this.question} 
                            tocheck=this.questionDB.some(element=>element.title == this.questionDB[obj].nextRef)
                             
                            if(this.questionDB[obj].nextRef!=='' && tocheck==false){ 
                              if(this.nextRefPlaceholder==''){
                              this.questionDB.push({...this.empty_question,title:this.question.nextRef,options:[],parentId:obj,id:this.questionDB.length+1})
                              }else{
                                let ind=this.questionDB.findIndex(x=>x.title==this.nextRefPlaceholder)
                                this.questionDB[ind].title = this.question.nextRef
                              }
                            } 
                         this.question.options.map((item,index)=>{
                          let check = this.questionDB.some(element=>element.id == item.id) 
                          if(!item.id){
                            //create new
                            if(item.next_question!=''){
                            this.questionDB[obj].options[index].id=this.questionDB.length+1
                            this.questionDB.push({...this.empty_question,title:item.next_question,options:[],parentId:obj,id:this.questionDB.length+1})
                            }
                          }else{
                                // update old
                                let objIndex
                                this.questionDB.filter((el,index)=>{if(el.id==item.id)objIndex=index})
                                this.questionDB[objIndex]={...this.questionDB[objIndex],title:this.question.options[index].next_question}
                            }
                        })

                }

             })
            }

        
        this.upDateDBNow() 
        if (this.questionDB.length>0){this.isEmpty=[1]}else{this.isEmpty=[0]}
        console.log(this.questionDB)

        this.question = {...this.empty_question}
        // this.optionTitle = null
        this.optionTitle = {...this.empty_question}
        this.nextRefPlaceholder==''
        this.editMode=false 
          }
    },
    switchRadio() {
      this.question.multiselect.status = !this.question.multiselect.status;
    },
    filterOptions(index) {
      const item_index = index;
      this.question.options = this.question.options.filter(
        (each, index) => index !== item_index
      );
    },
    copy(index) {
      this.question.options[index].next_question =
        this.question.options[index - 1].next_question;
    },
    add() {
      this.question.options.push({
        option: "",
        next_question: "",
        isEnd: "",
      });
    },
    change(){
        window.location.href = "http://example.com"
    },
    editOptions() {
      if (this.clicked === false) {
        this.indx = this.question.selectPredefinedOptions.length - 1;
      } else {
        this.indx = this.indx - 1;
      }
      this.predefinedOptions = this.question.selectPredefinedOptions[this.indx];
      this.optionLength = this.optionLength - 1;
      this.clicked = true;
    },
    truncate(data) {
      let readString = data;
      let cut = 45
      if (data.length > cut) {
        readString = data.slice(0, cut);
        readString = readString + "...";
      }
      return readString;
    },
    evtChange2(event){   
      this.errors.errs=0  
      const check = this.questionDB.filter((x) => {
          if (x.id == this.optionTitle.id) {
            return x;
          }
        }); 
        this.question = check[0]; 
        if(check[0].nextRef!='') {this.nextRefPlaceholder=check[0].nextRef} 
        this.editMode = true; 

      },
    evtChange1(event){   
      this.errors.errs=0
      const check = this.questionDB.filter((x) => {
        if (x.id == event.target.value) {
          return x;
        }
      }); 
      this.question = check[0]; 
      if(check[0].nextRef!='') {this.nextRefPlaceholder=check[0].nextRef} 
      this.editMode = true; 
    },
    editQuestion(e) {  
      this.errors.errs=0
      const check = this.questionDB.filter((x) => {
        if (x.id == e.target.id) {
          return x;
        }
      }); 
      this.question = check[0]; 
      this.optionTitle =  check[0]
      if(check[0].nextRef!='') {this.nextRefPlaceholder=check[0].nextRef} 
      this.editMode = true;   
    },
    deleteQuestion(e) {
      this.questionDB =
        this.questionDB.length > 0 &&
        this.questionDB.filter((x) => x.id != e.target.id);
      this.question = { ...this.empty_question };
      if (this.questionDB.length>0){this.isEmpty=[1]}else{this.isEmpty=[0]}

      this.upDateDBNow()

      this.editMode = false;
    },
  },
});

app.mount("#app");
