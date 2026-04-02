<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HelpRequest extends Model
{
    protected $fillable = ['name', 'contact', 'type', 'status'];
}
