from django.db import models

# Create your models here.
 

 

class Questionaire(models.Model):
    name = models.CharField(max_length=30)  

    def __str__(self):
        return self.name
        # return "%s %s" % (self.first_name, self.last_name)

class Question(models.Model):
    questionaire = models.ForeignKey(Questionaire, on_delete=models.CASCADE)
    title = models.CharField(max_length=100) 
    optionType = models.CharField(max_length=100) 
    theId = models.CharField(max_length=100) 
    theType = models.CharField(max_length=100) 
    multiselect = models.CharField(max_length=100) 
    parentId = models.CharField(max_length=100) 
    options = models.CharField(max_length=100) 
    nextRef = models.CharField(max_length=100) 
    groupText = models.CharField(max_length=100) 
    isEnd = models.CharField(max_length=100) 
    endNote = models.CharField(max_length=100) 

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']
 
 