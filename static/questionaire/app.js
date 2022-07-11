const app = Vue.createApp({
    
    // template:`<h1>{{firstName}}</h1>`,
    data() {
        return {
            errors:{
              title:'',
              optionType:'',
              _type:'',
              multiselect:'',
              groupText:'',
              endNote:''
            },
            questionDB: [],
            references: [],
            isEmpty:[1],
            currentLastId:0,
            isInvalid:'  ',
            //   constext: {},
            question: {
        title: "",
        optionType: "",
        id: "",
        type: "",
        multiselect: "",
        parentId: "",
        options: [],
        nextRef: '',
        // nextRef: { title:''},
        // nextRef: "",
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
  beforeMount(){
    this.getData()
 },
  methods: {
      getData: async function () {
      console.log('fetched')
      // this.questionDB=[]
      const res = await fetch("/questionaire/get").then(
        (response) => {
          return response.json(); 
        }
      );
      let data = await res;
      // console.log(data)
      data = data.replaceAll("'false'",false)
      data = data.replaceAll("'true'",true)
      // console.log(data)

      data = JSON.parse(data);

      if (data[0] !=0){
        this.isEmpty=[1]
        // console.log(this.isEmpty)
        const arr =[] 
        let jsonOptions  
        data.map(el=>{ 
          jsonOptions=JSON.parse(el.fields.options.replaceAll("'",'"')) 
          let k=el.fields.nextRef.replaceAll('"','') 
          // console.log(jsonOptions)
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
        console.log(arr)  
        arr.sort((a,b)=>a.id-b.id) 
        this.questionDB=arr
        
      }else{
        this.isEmpty=data
      }
    }, 
    upDateDBNow: async function () { 
        const model  = this.questionDB 
        // console.log('model')
        // console.log(this.questionDB)
        // console.log(model.length)
        let modelled =[]
        model.map(el=>{
            // let optionsMapped  
            // el.options.length>0?el.options.map(elm=>{
            //     console.log('here')
            //     optionsMapped.push({
            //         ...elm,
            //         // isEnd:elm.isEnd===true?'true':'false'
            //     })
            // }):optionsMapped=''
            // console.log(optionsMapped==el.options)
            // console.log(el.options)
            // console.log(typeof(optionsMapped))
            modelled.push({
            "groupText": el.groupText,
            "isEnd": el.isEnd,
            "multiselect": el.multiselect,
            "nextRef": el.nextRef,
            "optionType": el.optionType,
            // "options": optionsMapped,    //change and it worked
            "options":  el.options,    //change and it worked
            "parentId": el.parentId,
            "reference": el.parentId,  //change
            "theId": el.id,
            "theType": el.type,
            "title": el.title,
            "endNote": el.endNote,                
            })
        }) 
        const csrftoken = Cookies.get('csrftoken');
        console.log('hererererere')
        let payload = JSON.stringify(modelled)
        // console.log(payload)
        payload = payload.replaceAll(false,'"false"')
        payload = payload.replaceAll(true,'"true"')
        console.log('herererer')
        // console.log(payload)
        fetch(`/questionaire/update/`, {
            method: 'POST', // or 'PUT'
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
    // }
    // this.getData()
      }, 
    upDateDB(){ 

      // this.handleInput()
      // this.questionDB.map(el=>{
      //   if(el.id=='') {
      //     console.log('none')
      //   }else if(el.id>this.currentLastId) this.currentLastId=el.id
      // })
      // this.questionDB.map.length>1&&this.questionDB.map(el=>{if(el.id>this.currentLastId) this.currentLastId=el.id})
      // console.log(this.currentLastId) 
            if(!this.editMode && this.questionDB.length===0){ 
                console.log('new')
                this.questionDB = [...this.questionDB,{...this.question,id:this.questionDB.length+1}]
                this.currentLastId+=1
                let obj=0
                this.questionDB[obj].options.length>0&&this.questionDB[obj].options.map((item,index)=>{
                    this.questionDB[obj].options[index].id=this.questionDB.length+1
                    this.questionDB.push({...this.empty_question,title:item.next_question,options:[],parentId:obj,id:this.questionDB.length+1})
                    // this.currentLastId+=1 
                })
                if(this.question.nextRef !==''){  
                // this.questionDB[obj].nextRef =this.questionDB.length+1
                this.questionDB.push({...this.empty_question,title:this.question.nextRef ,options:[],parentId:obj,id:this.questionDB.length+1})
              }
              // if(this.question.nextRef.title!==''){  
              //   this.questionDB[obj].nextRef.id=this.questionDB.length+1
              //   this.questionDB.push({...this.empty_question,title:this.question.nextRef.title,options:[],parentId:obj,id:this.questionDB.length+1})
              // }
                console.log(this.question.nextRef!=='')

            }else{ 
                this.questionDB.map((each,index)=>{
                    if(each.id===this.question.id) {
                        // get this updated object index
                        let obj
                        this.questionDB.filter((el,index)=>{if(el.id==each.id)obj=index})
                        // update the object by index
                        this.questionDB[obj]= {...this.questionDB[obj],...this.question}


                        // if(this.questionDB[obj].nextRef.title!==''){
                        //   this.questionDB[obj].nextRef.id=this.questionDB.length+1
                        //   this.questionDB.push({...this.empty_question,title:this.question.nextRef.title,options:[],parentId:obj,id:this.questionDB.length+1})
                        // }
                        // this.questionDB.map(eels=>{
                        //   console.log(eels.title==this.questionDB[obj].nextRef)
                          // if(eels.title!==this.questionDB[obj].nextRef){ 
                            tocheck=this.questionDB.some(element=>element.title == this.questionDB[obj].nextRef)
                            console.log(tocheck)
                            console.log(tocheck==false)
                            if(this.questionDB[obj].nextRef!=='' && tocheck==false){
                            this.questionDB.push({...this.empty_question,title:this.question.nextRef,options:[],parentId:obj,id:this.questionDB.length+1})
                          }
                      //  }})
                        // loop through references of this object and update
                        this.question.options.map((item,index)=>{
                          let check = this.questionDB.some(element=>element.id == item.id)
                          //  
                          // 
                          // console.log(item.id==check)
                          // console.log(this.question.id == item.parentId)
                          // console.log(item.id, check)
                          // console.log(this.question.id, item.parentId)
                          if(!item.id){
                            this.questionDB[obj].options[index].id=this.questionDB.length+1
                            // add id to new questions and make them their own questions
                            this.questionDB.push({...this.empty_question,title:item.next_question,options:[],parentId:obj,id:this.questionDB.length+1})
                            // this.questionDB.push({...this.empty_question,title:item.next_question,options:[],parentId:obj,id:this.questionDB.length+1})
                          //  this.currentLastId+=1
                            
                          }else{
                                // update option name in its own question
                                let objIndex
                                this.questionDB.filter((el,index)=>{if(el.id==item.id)objIndex=index})
                                // console.log(objIndex)
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
        this.editMode=false


    },
    handleInput(){
      let errs=0
      const isError = ' form-control is-invalid required'
      const {title,optionType,type:_type,multiselect,groupText,endNote} = this.question

      if(!title){this.errors.title+=isError;errs=1}else{this.errors.title=''}
      if(!optionType){this.errors.optionType+=isError;errs=1}else{this.errors.optionType=''}
      if(!_type){this.errors._type+=isError;errs=1}else{this.errors._type=''}
      if(this.question.optionType=="Predefined")if(!multiselect){this.errors.multiselect+=isError;errs=1}else{this.errors.multiselect=''}
      // if(!groupText){this.errors.groupText+=isError;errs=1}else{this.errors.groupText=''}
      // if(!endNote){this.errors.endNote+=isError;errs=1}else{this.errors.endNote=''}
      errs==0&&this.upDateDB()
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
      // let errors=[]
      // this.question.title
      // this.question.optionType
      // this.question.type
      // this.question.multiselect
      // this.question.reference
      // this.question.options
      // this.question.nextRef
      // this.question.groupText
      // this.question.isEnd

      this.question.options.push({
        option: "",
        next_question: "",
        isEnd: "",
        // id:this.questionDB.length+this.question.options.length
      });
    },
    change(){
        console.log('herel')
        window.location.href = "http://example.com"
    },
    editOptions() {
      //fix updating later
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
    evtChange(event){ 
      console.log('here')
      console.log(event.target.value)
      const check = this.questionDB.filter((x) => {
          // console.log(x)
          if (x.id == event.target.value) {
            return x;
          }
        }); 
      console.log(check[0]) 
        this.question = check[0]; 
        this.editMode = true; 
    },
    editQuestion(e) { 
      const even = {target:{value:event.target.id}}
    
      // const check = this.questionDB.filter((x) => { 
      //   if (x.id == e.target.id) {
      //     return x;
      //   }
      // }); 
      // this.question = check[0]; 
      // this.editMode = true;
      this.evtChange(even)
    },
    deleteQuestion(e) {
      this.questionDB =
        this.questionDB.length > 0 &&
        this.questionDB.filter((x) => x.id != e.target.id);
      this.question = { ...this.empty_question };
      // console.log(this.questionDB.length)
      if (this.questionDB.length>0){this.isEmpty=[1]}else{this.isEmpty=[0]}
      // console.log(this.isEmpty)

      this.upDateDBNow()

      this.editMode = false;
    },
  },
});

app.mount("#app");
