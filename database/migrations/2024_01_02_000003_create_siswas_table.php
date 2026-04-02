<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('siswas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nisn')->unique();
            $table->string('name');
            $table->string('class')->nullable();
            $table->foreignId('dudi_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('pembimbing_id')->nullable()->constrained()->nullOnDelete();
            $table->date('pkl_start')->nullable();
            $table->date('pkl_end')->nullable();
            $table->string('password_plain')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siswas');
    }
};
